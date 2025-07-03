use actix_web::web;

mod handlers;

pub fn authentication(cfg: &mut web::ServiceConfig) {
    cfg.service(handlers::credentials::register);
}
