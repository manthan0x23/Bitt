pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_users_table;
mod m20250703_070706_create_admin_table;
mod m20250703_071756_create_organizations_table;
mod m20250703_071802_create_roles_table;
mod m20250703_075452_admin_organization_roles_foreign_keys;
mod m20250703_111051_create_invite_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_users_table::Migration),
            Box::new(m20250703_070706_create_admin_table::Migration),
            Box::new(m20250703_071756_create_organizations_table::Migration),
            Box::new(m20250703_071802_create_roles_table::Migration),
            Box::new(m20250703_075452_admin_organization_roles_foreign_keys::Migration),
            Box::new(m20250703_111051_create_invite_table::Migration),
        ]
    }
}
