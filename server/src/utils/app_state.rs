use sea_orm::DatabaseConnection;

#[derive(Debug, Clone)]
pub struct AppState {
    pub database: DatabaseConnection,
}

impl AppState {
    pub fn get_db(&self) -> &DatabaseConnection {
        &self.database
    }
}
