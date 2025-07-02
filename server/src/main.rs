use actix_web::{App, HttpResponse, HttpServer, Responder, get, middleware::Logger};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[get("/greet")]
async fn greet() -> impl Responder {
    HttpResponse::Ok().body("Greet world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let log_level = std::env::var_os("RUST_LOG");
    if log_level.is_none() {
        unsafe {
            std::env::set_var("RUST_LOG", "info");
        }
    }

    println!("Logger level :: {:?}", log_level);

    env_logger::init();

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .service(hello)
            .service(greet)
    })
    .bind(("127.0.0.1", 5000))?
    .run()
    .await
}
