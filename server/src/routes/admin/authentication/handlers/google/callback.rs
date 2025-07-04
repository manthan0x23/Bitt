use crate::utils::{
    app_state::AppState,
    web::{errors::AppError, response::ApiResponse},
};
use actix_web::{
    HttpRequest, HttpResponse,
    cookie::{Cookie, SameSite},
    get, web,
};
use common::{
    id::short_id,
    types::session::{SessionClaim, UserType},
};
use database::entity::{admins as Admins, roles as Roles};
use reqwest::Client;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};
use serde::Deserialize;
use serde_json::Value;

#[derive(Debug, Deserialize)]
struct CallbackQuery {
    pub code: String,
}

#[get("callback")]
pub async fn callback(
    req: HttpRequest,
    query: web::Query<CallbackQuery>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let db = &app_state.database;
    let redis_pool = &app_state.redis_pool;

    let code = &query.code;

    if code.is_empty() {
        return Err(AppError::bad_request("No code provided"));
    }

    let origin = format!(
        "{}://{}",
        req.connection_info().scheme(),
        req.connection_info().host()
    );
    let redirect_uri = format!("{}/api/admin/auth/google/callback", origin);

    let client = Client::new();

    let params = [
        ("code", code.as_str()),
        ("client_id", &app_state.env.google_auth_client_id),
        ("client_secret", &app_state.env.google_auth_client_secret),
        ("redirect_uri", &redirect_uri),
        ("grant_type", "authorization_code"),
    ];

    let token_res = client
        .post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send()
        .await
        .map_err(|e| AppError::internal_server_error(&format!("Token exchange failed: {}", e)))?;

    if !token_res.status().is_success() {
        return Err(AppError::bad_request("Google token exchange failed"));
    }

    let token_data: Value = token_res
        .json()
        .await
        .map_err(|e| AppError::internal_server_error(&format!("Token parse failed: {}", e)))?;

    let id_token = token_data
        .get("id_token")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::bad_request("Missing id_token"))?;

    let verify_res = client
        .get(format!(
            "https://oauth2.googleapis.com/tokeninfo?id_token={}",
            id_token
        ))
        .send()
        .await
        .map_err(|e| AppError::internal_server_error(&format!("Verify failed: {}", e)))?;

    if !verify_res.status().is_success() {
        return Err(AppError::bad_request("Google token verify failed"));
    }

    let payload: Value = verify_res
        .json()
        .await
        .map_err(|e| AppError::internal_server_error(&format!("Payload parse failed: {}", e)))?;

    let email = payload
        .get("email")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::bad_request("Missing email"))?;

    let email_verified = payload
        .get("email_verified")
        .and_then(|v| v.as_str())
        .unwrap_or("false")
        == "true";

    let name = payload
        .get("name")
        .and_then(|v| v.as_str())
        .unwrap_or("No Name");

    let picture = payload
        .get("picture")
        .and_then(|v| v.as_str())
        .unwrap_or("");

    // Find or insert admin
    let mut admin = Admins::Entity::find()
        .filter(Admins::Column::WorkEmail.eq(email))
        .one(db)
        .await
        .map_err(|e| AppError::internal_server_error(&format!("DB error: {}", e)))?;

    if admin.is_none() {
        let active = Admins::ActiveModel {
            work_email: Set(email.to_string()),
            username: Set(format!(
                "{}_{}",
                email.split('@').next().unwrap_or("user"),
                short_id(None)
            )),
            name: Set(Some(name.to_string())),
            avatar_url: Set(Some(picture.to_string())),
            email_verified: Set(email_verified),
            password: Set(None),
            ..Default::default()
        };
        admin = Some(
            active
                .insert(db)
                .await
                .map_err(|e| AppError::internal_server_error(&format!("Insert failed: {}", e)))?,
        );
    } else if email_verified {
        let mut active: Admins::ActiveModel = admin.clone().unwrap().into();
        active.email_verified = Set(true);
        active.avatar_url = Set(Some(picture.to_string()));
        active.name = Set(Some(name.to_string()));
        active
            .update(db)
            .await
            .map_err(|e| AppError::internal_server_error(&format!("Update failed: {}", e)))?;
    }

    let admin = admin.unwrap();

    // Role check
    let mut capabilities: Vec<String> = Vec::new();
    if let Some(role_id) = admin.role_id.clone() {
        let role = Roles::Entity::find_by_id(role_id)
            .one(db)
            .await
            .map_err(|e| AppError::internal_server_error(&format!("Role lookup failed: {}", e)))?;

        if let Some(role) = role {
            capabilities = role
                .capabilities
                .into_iter()
                .map(|c| format!("{:?}", c))
                .collect();
        }
    }

    let session = SessionClaim::new(
        admin.id.clone(),
        UserType::Admin,
        admin.role_id,
        "".to_string(),
    );

    let session_id = redis::session::create_user_session(redis_pool, &session, None)
        .await
        .map_err(|_| AppError::internal_server_error("Couldn't create session"))?;

    let cookie = Cookie::build("sessionId", session_id.clone())
        .path("/")
        .http_only(true)
        .secure(app_state.env.cargo_env == "production")
        .same_site(SameSite::Lax)
        .finish();

    let client_url = &app_state.env.client_url;
    let client_url_string = client_url.to_string();

    let mut response = {
        let mut res = HttpResponse::TemporaryRedirect();
        res.append_header(("Location", client_url_string));
        res.cookie(cookie);
        res
    };

    Ok(response.finish())
}
