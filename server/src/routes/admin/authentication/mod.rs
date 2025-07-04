use actix_web::web::{self, scope};

mod handlers;

pub fn authentication(cfg: &mut web::ServiceConfig) {
    cfg.service(
        scope("credentials")
            .service(handlers::credentials::register)
            .service(handlers::credentials::login),
    )
    .service(
        scope("google")
            .service(handlers::google::callback)
            .service(handlers::google::login),
    );
}
