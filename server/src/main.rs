use actix_web::{App, HttpServer, middleware::Logger, web};
use std::env;
use tracing::{error, info};
use tracing_subscriber;

mod health_check;
mod utils;

use utils::app_state::AppState;

fn configure_env() {
    dotenv::dotenv().ok();

    if env::var_os("RUST_LOG").is_none() {
        unsafe {
            env::set_var("RUST_LOG", "info,actix_web=info");
        }
    }

    tracing_subscriber::fmt::init();
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    configure_env();

    let database_url = utils::env::DATABASE_URL.clone();
    let redis_url = utils::env::REDIS_URL.clone();
    let bind_server = (utils::env::ADDRESS.clone(), utils::env::PORT.clone());

    let db = match database::connect::connect_and_migrate(&database_url).await {
        Ok(conn) => {
            info!("Connected to PostgreSQL");
            conn
        }
        Err(e) => {
            error!("Failed to connect to PostgreSQL: {}", e);
            panic!("Postgres connection failed");
        }
    };

    let redis_pool = match redis::connect::create_redis_pool(&redis_url) {
        Ok(pool) => {
            info!("Created Redis pool");
            pool
        }
        Err(e) => {
            error!("Failed to create Redis pool: {}", e);
            panic!("Redis pool creation failed");
        }
    };

    if let Err(e) = redis::connect::ping_redis(&redis_pool).await {
        error!("Redis PING failed: {}", e);
        panic!("Unable to connect to Redis server");
    } else {
        info!("Connected to Redis server");
    }

    let app_state = web::Data::new(AppState {
        database: db,
        redis_pool: redis_pool,
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .wrap(Logger::default())
            .service(health_check::health_check)
    })
    .workers(2)
    .bind(bind_server)?
    .run()
    .await
}
