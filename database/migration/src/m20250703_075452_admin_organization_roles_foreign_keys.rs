use sea_orm_migration::prelude::*;

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
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_admins_role_id")
                    .from(Admins::Table, Admins::RoleId)
                    .to(Roles::Table, Roles::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_roles_organization_id")
                    .from(Roles::Table, Roles::OrganizationId)
                    .to(Organizations::Table, Organizations::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_organizations_created_by")
                    .from(Organizations::Table, Organizations::CreatedBy)
                    .to(Admins::Table, Admins::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Drop in reverse order of creation

        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name("fk_organizations_created_by")
                    .table(Organizations::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name("fk_roles_organization_id")
                    .table(Roles::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name("fk_admins_role_id")
                    .table(Admins::Table)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }
}
