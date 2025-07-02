use common::id::short_id::short_id;
use sea_orm_migration::{
    prelude::{extension::postgres::Type, *},
    schema::*,
    sea_orm::{EnumIter, Iterable},
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(AccountSourceEnum)
                    .values(AccountSourceVariants::iter())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Users::Table)
                    .if_not_exists()
                    .col(
                        string(Users::Id)
                            .not_null()
                            .default(short_id(None))
                            .primary_key(),
                    )
                    .col(string(Users::Name).not_null())
                    .col(string(Users::Usersname).not_null().unique_key())
                    .col(string(Users::Email).not_null().unique_key())
                    .col(string(Users::Password))
                    .col(string(Users::PictureUrl))
                    .col(boolean(Users::EmailVerified).default(false).not_null())
                    .col(enumeration_null(
                        Users::AccountSource,
                        AccountSourceEnum,
                        AccountSourceVariants::iter(),
                    ))
                    .col(string(Users::Resume).default("").not_null())
                    .col(
                        date_time(Users::CreatedAt)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        date_time(Users::UpdatedAt)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(boolean(Users::IsDeleted).not_null().default(false))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Drop table first
        manager
            .drop_table(Table::drop().table(Users::Table).to_owned())
            .await?;

        // Drop enum type
        manager
            .drop_type(Type::drop().name(AccountSourceEnum).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Users {
    Table,
    Id,
    Name,
    Usersname,
    Email,
    Password,
    PictureUrl,
    EmailVerified,
    AccountSource,
    Resume,
    CreatedAt,
    UpdatedAt,
    IsDeleted,
}

#[derive(Iden)]
pub struct AccountSourceEnum;

#[derive(Iden, EnumIter)]
pub enum AccountSourceVariants {
    #[iden = "google"]
    Google,

    #[iden = "credentials"]
    Credentials,

    #[iden = "github"]
    Github,
}
