use actix_web::{App, HttpServer, middleware::Logger, web};
use core::panic;

use crate::utils::app_state::AppState;

mod utils;

fn env_configure() {
    dotenv::dotenv().ok();

    if std::env::var_os("RUST_LOG").is_none() {
        unsafe {
            std::env::set_var("RUST_LOG", "actix_web=info");
        }
    }

    env_logger::init();
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_configure();

    let database_url = (*utils::env::DATABASE_URL).clone();

    let db = database::connect::connect_and_migrate(&database_url)
        .await
        .unwrap_or_else(|e| {
            panic!("Error in database connection {}", e.to_string());
        });

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState {
                database: db.clone(),
            }))
            .wrap(Logger::default())
    })
    .workers(2)
    .bind(("0.0.0.0", 5000))?
    .run()
    .await
}
