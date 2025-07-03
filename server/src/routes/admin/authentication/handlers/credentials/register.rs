use crate::utils::{
    app_state::AppState,
    validator::validate_or_bad_request,
    web::{errors::AppError, response::ApiResponse},
};
use actix_web::{HttpResponse, http::StatusCode, post, web};
use database::entity::admins as Admins;
use log::warn;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Validate, Deserialize, Clone)]
struct RegisterInput {
    #[validate(length(min = 1, message = "Name is required"))]
    pub name: String,

    #[validate(email(message = "Invalid email format"))]
    pub email: String,

    #[validate(length(min = 5, message = "Password must be at least 5 characters"))]
    pub password: String,
}

#[post("register")]
pub async fn register(
    register_input: web::Json<RegisterInput>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let input = register_input.into_inner();
    let db = &app_state.database;

    validate_or_bad_request(&input)?;

    warn!("BAD REQUEST CROSSED");
    if Admins::Entity::find()
        .filter(Admins::Column::WorkEmail.eq(input.email.clone()))
        .one(db)
        .await
        .map_err(|e| AppError::internal_server_error(&e.to_string()))?
        .is_some()
    {
        return Err(AppError::conflict("Email already registered"));
    }

    let username = input
        .email
        .split('@')
        .next()
        .unwrap_or(&input.email)
        .to_string();

    let active: Admins::ActiveModel = Admins::ActiveModel {
        name: Set(input.name),
        work_email: Set(input.email),
        password: Set(input.password), // TODO: hash!
        username: Set(username.clone()),
        ..Default::default()
    };

    let inserted = active
        .insert(db)
        .await
        .map_err(|e| AppError::internal_server_error(&e.to_string()))?;

    let response: ApiResponse<String> =
        ApiResponse::ok("Admin registered successfully", inserted.id);
    Ok(response.respond(StatusCode::CREATED))
}
