use actix_web::web::{self, scope};

use crate::routes::admin::*;

pub fn configure_admin_routes(web_service: &mut web::ServiceConfig) {
    web_service.service(scope("auth").configure(authentication));
}
