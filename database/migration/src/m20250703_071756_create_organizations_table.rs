use common::id::short_id;
use sea_orm_migration::prelude::*;
use sea_orm_migration::schema::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Organizations::Table)
                    .if_not_exists()
                    .col(
                        string(Organizations::Id)
                            .not_null()
                            .default(short_id(None))
                            .primary_key()
                            .unique_key(),
                    )
                    .col(string(Organizations::Name).not_null())
                    .col(text(Organizations::Slug).not_null())
                    .col(text_null(Organizations::Description))
                    .col(text_null(Organizations::LogoUrl))
                    .col(text(Organizations::BillingEmailAddress).not_null())
                    .col(
                        boolean(Organizations::BillingEmailVerified)
                            .default(false)
                            .not_null(),
                    )
                    .col(text(Organizations::Origin).not_null())
                    .col(date_null(Organizations::StartDate))
                    .col(
                        date_time(Organizations::CreatedAt)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        date_time(Organizations::UpdatedAt)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(string(Organizations::CreatedBy).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Organizations::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Organizations {
    Table,
    Id,
    Name,
    Slug,
    Description,
    LogoUrl,
    BillingEmailAddress,
    BillingEmailVerified,
    Origin,
    StartDate,
    CreatedAt,
    UpdatedAt,
    CreatedBy,
}
