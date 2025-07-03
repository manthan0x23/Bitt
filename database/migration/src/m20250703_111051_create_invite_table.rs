use common::id::short_id::short_id;
use sea_orm::Iterable;
use sea_orm_migration::{
    prelude::{extension::postgres::Type, *},
    schema::*,
    sea_orm::EnumIter,
};

use crate::{
    m20250703_070706_create_admin_table::Admins,
    m20250703_071756_create_organizations_table::Organizations,
    m20250703_071802_create_roles_table::Roles,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(InviteTypeEnum)
                    .values(InviteTypeVariants::iter())
                    .to_owned(),
            )
            .await?;

        manager
            .create_type(
                Type::create()
                    .as_enum(InviteStatusEnum)
                    .values(InviteStatusVariants::iter())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(OrganizationInvite::Table)
                    .if_not_exists()
                    .col(
                        string(OrganizationInvite::Id)
                            .not_null()
                            .primary_key()
                            .unique_key()
                            .default(short_id(Some(8))),
                    )
                    .col(
                        string(OrganizationInvite::Code)
                            .not_null()
                            .unique_key()
                            .string_len(64)
                            .default(short_id(Some(8))),
                    )
                    .col(string(OrganizationInvite::OrganizationId).not_null())
                    .col(string(OrganizationInvite::RoleId))
                    .col(
                        ColumnDef::new(OrganizationInvite::AllowedOrigins)
                            .array(ColumnType::Text)
                            .not_null()
                            .default("{}"),
                    )
                    .col(
                        enumeration(
                            OrganizationInvite::InviteType,
                            InviteTypeEnum,
                            InviteTypeVariants::iter(),
                        )
                        .not_null()
                        .default(InviteTypeVariants::Strict.to_string()),
                    )
                    .col(
                        integer(OrganizationInvite::UsageLimit)
                            .not_null()
                            .default(1),
                    )
                    .col(
                        integer(OrganizationInvite::UsageCount)
                            .not_null()
                            .default(0),
                    )
                    .col(string(OrganizationInvite::CreatedBy).not_null())
                    .col(
                        enumeration(
                            OrganizationInvite::Status,
                            InviteStatusEnum,
                            InviteStatusVariants::iter(),
                        )
                        .not_null()
                        .default(InviteStatusVariants::Active.to_string()),
                    )
                    .col(timestamp(OrganizationInvite::EndDate).not_null())
                    .col(
                        timestamp(OrganizationInvite::CreatedAt)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(timestamp(OrganizationInvite::DeletedAt))
                    .col(timestamp(OrganizationInvite::UpdatedAt))
                    // Foreign keys
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_invite_org")
                            .from(
                                OrganizationInvite::Table,
                                OrganizationInvite::OrganizationId,
                            )
                            .to(Organizations::Table, Organizations::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_invite_role")
                            .from(OrganizationInvite::Table, OrganizationInvite::RoleId)
                            .to(Roles::Table, Roles::Id)
                            .on_delete(ForeignKeyAction::SetNull),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_invite_created_by")
                            .from(OrganizationInvite::Table, OrganizationInvite::CreatedBy)
                            .to(Admins::Table, Admins::Id)
                            .on_delete(ForeignKeyAction::SetNull),
                    )
                    .to_owned(),
            )
            .await?;

        // Now create indexes separately
        manager
            .create_index(
                Index::create()
                    .name("organization_invite_organizationId_idx")
                    .table(OrganizationInvite::Table)
                    .col(OrganizationInvite::OrganizationId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("organization_invite_code_idx")
                    .table(OrganizationInvite::Table)
                    .col(OrganizationInvite::Code)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("organization_invite_createdBy_idx")
                    .table(OrganizationInvite::Table)
                    .col(OrganizationInvite::CreatedBy)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("organization_invite_status_idx")
                    .table(OrganizationInvite::Table)
                    .col(OrganizationInvite::Status)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(OrganizationInvite::Table).to_owned())
            .await?;

        manager
            .drop_type(Type::drop().name(InviteTypeEnum).to_owned())
            .await?;

        manager
            .drop_type(Type::drop().name(InviteStatusEnum).to_owned())
            .await?;

        Ok(())
    }
}

// ------------------- ENUMS -------------------

#[derive(DeriveIden)]
pub struct InviteTypeEnum;

#[derive(EnumIter, DeriveIden)]
pub enum InviteTypeVariants {
    #[sea_orm(iden = "open-for-all")]
    OpenForAll,
    #[sea_orm(iden = "strict")]
    Strict,
}

#[derive(DeriveIden)]
pub struct InviteStatusEnum;

#[derive(EnumIter, DeriveIden)]
pub enum InviteStatusVariants {
    #[sea_orm(iden = "active")]
    Active,
    #[sea_orm(iden = "closed")]
    Closed,
    #[sea_orm(iden = "expired")]
    Expired,
    #[sea_orm(iden = "limit_reached")]
    LimitReached,
    #[sea_orm(iden = "deleted")]
    Deleted,
}

// ------------------- IDEN TABLES -------------------

#[derive(DeriveIden)]
pub enum OrganizationInvite {
    Table,
    Id,
    Code,
    OrganizationId,
    RoleId,
    AllowedOrigins,
    InviteType,
    UsageLimit,
    UsageCount,
    CreatedBy,
    Status,
    EndDate,
    CreatedAt,
    DeletedAt,
    UpdatedAt,
}
