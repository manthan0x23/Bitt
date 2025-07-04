use common::id::short_id;
use sea_orm_migration::{
    prelude::{extension::postgres::Type, *},
    schema::*,
    sea_orm::EnumIter,
};

use sea_orm::Iterable;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(CapabilityEnum)
                    .values(CapabilityVariants::iter())
                    .to_owned(),
            )
            .await?;
        manager
            .create_type(
                Type::create()
                    .as_enum(ColorSchemeEnum)
                    .values(ColorSchemeVariants::iter())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Roles::Table)
                    .if_not_exists()
                    .col(
                        string(Roles::Id)
                            .not_null()
                            .primary_key()
                            .unique_key()
                            .default(short_id(None)),
                    )
                    .col(string(Roles::Tag).not_null().string_len(64))
                    .col(
                        array(
                            Roles::Capabilities,
                            ColumnType::Enum {
                                name: CapabilityEnum.into_iden(),
                                variants: CapabilityVariants::iter().map(SeaRc::new).collect(),
                            },
                        )
                        .not_null()
                        .default("{}"),
                    )
                    .col(
                        enumeration(
                            Roles::ColorScheme,
                            ColorSchemeEnum,
                            ColorSchemeVariants::iter(),
                        )
                        .not_null()
                        .default(ColorSchemeVariants::Gray.to_string()),
                    )
                    .col(boolean(Roles::IsTemplate).not_null().default(false))
                    .col(string(Roles::OrganizationId).not_null())
                    .index(
                        Index::create()
                            .name("org_id_tag_idx")
                            .unique()
                            .col(Roles::OrganizationId)
                            .col(Roles::Tag),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Roles::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Roles {
    Table,
    Id,
    Tag,
    Capabilities,
    OrganizationId,
    ColorScheme,
    IsTemplate,
}

#[derive(DeriveIden)]
pub struct ColorSchemeEnum;

#[derive(DeriveIden, EnumIter)]
pub enum ColorSchemeVariants {
    #[sea_orm(iden = "color_scheme")]
    Table,
    Gray,
    Blue,
    Green,
    Red,
    Pink,
    Orange,
    Yellow,
    Purple,
    Teal,
    Indigo,
}

#[derive(DeriveIden)]
pub struct CapabilityEnum;

#[derive(DeriveIden, EnumIter)]
pub enum CapabilityVariants {
    #[sea_orm(iden = "capability")]
    Table,
    #[sea_orm(iden = "update.organizationDetails")]
    UpdateOrganizationDetails,

    #[sea_orm(iden = "create.job")]
    CreateJob,
    #[sea_orm(iden = "update.job")]
    UpdateJob,
    #[sea_orm(iden = "delete.job")]
    DeleteJob,

    #[sea_orm(iden = "create.stage")]
    CreateStage,
    #[sea_orm(iden = "update.stage")]
    UpdateStage,
    #[sea_orm(iden = "delete.stage")]
    DeleteStage,

    #[sea_orm(iden = "update.contest")]
    UpdateContest,
    #[sea_orm(iden = "create.contest_problem")]
    CreateContestProblem,
    #[sea_orm(iden = "update.contest_problem")]
    UpdateContestProblem,
    #[sea_orm(iden = "delete.contest_problem")]
    DeleteContestProblem,

    #[sea_orm(iden = "update.billing")]
    UpdateBilling,
    #[sea_orm(iden = "view.analytics")]
    ViewAnalytics,

    #[sea_orm(iden = "create.invite")]
    CreateInvite,
    #[sea_orm(iden = "read.invite")]
    ReadInvite,
    #[sea_orm(iden = "update.invite")]
    UpdateInvite,
    #[sea_orm(iden = "delete.invite")]
    DeleteInvite,

    #[sea_orm(iden = "assign.task")]
    AssignTask,
    #[sea_orm(iden = "view.task")]
    ViewTask,
    #[sea_orm(iden = "update.task")]
    UpdateTask,
    #[sea_orm(iden = "delete.task")]
    DeleteTask,

    #[sea_orm(iden = "schedule.interview")]
    ScheduleInterview,
    #[sea_orm(iden = "take.interview")]
    TakeInterview,

    #[sea_orm(iden = "pass.candidate.stage")]
    PassCandidateStage,
    #[sea_orm(iden = "view.candidate.submissions")]
    ViewCandidateSubmissions,

    #[sea_orm(iden = "create.quiz_problem")]
    CreateQuizProblem,
    #[sea_orm(iden = "update.quiz_problem")]
    UpdateQuizProblem,
    #[sea_orm(iden = "read.quiz_problem")]
    ReadQuizProblem,

    #[sea_orm(iden = "update.quiz")]
    UpdateQuiz,
    #[sea_orm(iden = "generate.quiz")]
    GenerateQuiz,
    #[sea_orm(iden = "read.quiz")]
    ReadQuiz,

    #[sea_orm(iden = "manage.roles")]
    ManageRoles,
}
