use std::env;

use lazy_static::lazy_static;

fn use_database_url() -> String {
    dotenv::dotenv().ok();

    env::var("DATABASE_URL")
        .expect("DATABASE_URL is required in the environment")
        .parse::<String>()
        .expect("DATABASE_URL is expected to be of type `String` ")
}

lazy_static! {
    pub static ref DATABASE_URL: String = use_database_url();
}
