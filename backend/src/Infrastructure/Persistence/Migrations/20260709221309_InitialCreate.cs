using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiWorkflowAutomationDashboard.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkflowRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    BusinessName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 240, nullable: false),
                    RequestType = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    Context = table.Column<string>(type: "TEXT", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: false),
                    DesiredOutputType = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    Priority = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    GeneratedOutput = table.Column<string>(type: "TEXT", nullable: true),
                    ReviewedOutput = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ErrorMessage = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkflowRequests", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkflowRequests_Status",
                table: "WorkflowRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_WorkflowRequests_UpdatedAt",
                table: "WorkflowRequests",
                column: "UpdatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkflowRequests");
        }
    }
}
