use actix_web::web::{self, scope};

use crate::routes::verify;
pub use crate::routes::{admin, user};

pub fn app_root(web_service: &mut web::ServiceConfig) {
    web_service.service(verify);
    web_service.service(scope("admin").configure(admin::configure_admin_routes));
    web_service.service(scope("user").configure(user::configure_user_routes));
}
