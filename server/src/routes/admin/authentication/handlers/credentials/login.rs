use crate::utils::{
    app_state::AppState,
    validator::validate_or_bad_request,
    web::{errors::AppError, response::ApiResponse},
};
use actix_web::{
    HttpResponse,
    cookie::{self, Cookie},
    http::StatusCode,
    post, web,
};
use common::{hashing::HashService, types::session::SessionClaim};
use database::entity::admins as Admins;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Validate, Deserialize, Clone)]
struct LoginInput {
    #[validate(email(message = "Invalid email format"))]
    pub email: String,

    #[validate(length(min = 5, message = "Password must be at least 5 characters"))]
    pub password: String,
}

#[derive(Debug, Serialize, Clone)]
struct LoginReponse {
    #[serde(rename = "sessionId")]
    pub session_id: String,
}

#[post("login")]
pub async fn login(
    req: actix_web::HttpRequest,
    login_input: web::Json<LoginInput>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let input = login_input.into_inner();
    let db = &app_state.database;
    let redis_pool = &app_state.redis_pool;

    validate_or_bad_request(&input)?;

    let admin = Admins::Entity::find()
        .filter(Admins::Column::WorkEmail.eq(input.email.clone()))
        .one(db)
        .await
        .map_err(|e| AppError::internal_server_error(&e.to_string()))?;

    let admin = match admin {
        Some(a) => a,
        None => {
            return Err(AppError::not_found(
                "Admin not found in the database please register first.",
            ));
        }
    };

    let db_password = match admin.password {
        Some(ref p) => p,
        None => {
            return Err(AppError::forbidden("Incorrect login attempt!"));
        }
    };

    let ip_address = req
        .peer_addr()
        .map(|addr| addr.ip().to_string())
        .unwrap_or_else(|| "unknown".to_string());

    let cmp_password = HashService::compare(&input.password, db_password)
        .map_err(|_| AppError::internal_server_error("Internal Server Error"))?;

    if !cmp_password {
        return Err(AppError::forbidden("Incorrect login credentials"));
    }

    let session = SessionClaim::new(
        admin.id.clone(),
        common::types::session::UserType::Admin,
        None,
        ip_address,
    );

    let session_id = redis::session::create_user_session(redis_pool, &session, None)
        .await
        .map_err(|_| {
            AppError::internal_server_error("Couldn't create user session try to login again.")
        })?;

    let cookie = Cookie::build("sessionId", session_id.clone())
        .path("/")
        .same_site(cookie::SameSite::None)
        .finish();

    let response: ApiResponse<LoginReponse> = ApiResponse::ok(
        "Admin logged in successfully",
        LoginReponse {
            session_id: session_id.clone(),
        },
    );

    let mut http_response = response.respond(StatusCode::ACCEPTED);
    http_response
        .add_cookie(&cookie)
        .map_err(|e| AppError::internal_server_error(&e.to_string()))?;
    Ok(http_response)
}
