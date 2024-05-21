using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendMedicalApplication.Migrations
{
    /// <inheritdoc />
    public partial class AddContactFormSubmissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactFormSubmissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Dob = table.Column<DateTime>(nullable: false),
                    Comments = table.Column<string>(nullable: true),
                    AgreeTerms = table.Column<bool>(nullable: false),
                    AgreePrivacy = table.Column<bool>(nullable: false),
                    AgreeMarketing = table.Column<bool>(nullable: false),
                    SubmissionDate = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                   table.PrimaryKey("PK_ContactFormSubmissions", x => x.Id);
                });
        }
    }
}
