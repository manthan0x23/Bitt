use actix_web::{HttpResponse, http::StatusCode};
use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T: Serialize> {
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn ok(message: &str, data: T) -> Self {
        Self {
            message: message.to_string(),
            data: Some(data),
            error: None,
        }
    }

    pub fn err(message: &str, error: &str) -> ApiResponse<()> {
        ApiResponse {
            message: message.to_string(),
            data: None,
            error: Some(error.to_string()),
        }
    }

    pub fn respond(&self, status_code: StatusCode) -> HttpResponse {
        HttpResponse::build(status_code).json(self)
    }
}
