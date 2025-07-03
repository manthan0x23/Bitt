use crate::m20220101_000001_create_users_table::{AccountSourceEnum, AccountSourceVariants};
use common::id::short_id::short_id;
use sea_orm_migration::{prelude::*, schema::*, sea_orm::Iterable};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Admins::Table)
                    .if_not_exists()
                    .col(
                        string(Admins::Id)
                            .primary_key()
                            .unique_key()
                            .not_null()
                            .default(short_id(None)),
                    )
                    .col(string(Admins::Name))
                    .col(string(Admins::Username).not_null().unique_key())
                    .col(string(Admins::WorkEmail).not_null().unique_key())
                    .col(string(Admins::Password))
                    .col(boolean(Admins::EmailVerified).default(false).not_null())
                    .col(boolean(Admins::AvatarUrl))
                    .col(
                        enumeration(
                            Admins::AccountSource,
                            AccountSourceEnum,
                            AccountSourceVariants::iter(),
                        )
                        .default(AccountSourceVariants::Credentials.to_string())
                        .not_null(),
                    )
                    .col(string(Admins::Role))
                    .col(
                        date_time(Admins::CreatedAt)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        date_time(Admins::UpdatedAt)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(boolean(Admins::IsDeleted).default(false).not_null())
                    .col(string(Admins::RoleId).not_null())
                    .col(string(Admins::OrganizationId))
                    .index(
                        Index::create()
                            .name("admin-organization-idx")
                            .unique()
                            .col(Admins::Id)
                            .col(Admins::OrganizationId),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Admins::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Admins {
    Table,
    Id,
    Name,
    Username,
    WorkEmail,
    Password,
    EmailVerified,
    AvatarUrl,
    AccountSource,
    Role,
    RoleId,
    CreatedAt,
    IsDeleted,
    UpdatedAt,
    OrganizationId,
}
