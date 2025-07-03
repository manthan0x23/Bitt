use std::env;

use lazy_static::lazy_static;

fn use_database_url() -> String {
    dotenv::dotenv().ok();

    env::var("DATABASE_URL")
        .expect("DATABASE_URL is required in the environment")
        .parse::<String>()
        .expect("DATABASE_URL is expected to be of type `String` ")
}

fn use_redis_url() -> String {
    dotenv::dotenv().ok();

    env::var("REDIS_URL")
        .expect("REDIS_URL is required in the environment")
        .parse::<String>()
        .expect("REDIS_URL is expected to be of type `String` ")
}
fn use_port() -> u16 {
    dotenv::dotenv().ok();

    env::var("PORT")
        .unwrap_or(5000.to_string())
        .parse::<u16>()
        .expect("PORT is expected to be of type `u16` ")
}

fn use_address() -> String {
    dotenv::dotenv().ok();

    env::var("ADDRESS")
        .unwrap_or("0.0.0.0".to_string())
        .parse::<String>()
        .expect("ADDRESS is expected to be of type `String` ")
}

lazy_static! {
    pub static ref DATABASE_URL: String = use_database_url();
    pub static ref REDIS_URL: String = use_redis_url();
    pub static ref ADDRESS: String = use_address();
    pub static ref PORT: u16 = use_port();
}
