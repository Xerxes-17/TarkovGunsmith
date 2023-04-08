using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WishGranter.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ammos",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ammos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Armors",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Armors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Results",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ArmorId = table.Column<string>(type: "TEXT", nullable: false),
                    DurabilityPerc = table.Column<int>(type: "INTEGER", nullable: false),
                    AmmoId = table.Column<string>(type: "TEXT", nullable: false),
                    Distance = table.Column<int>(type: "INTEGER", nullable: false),
                    Killshot = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Results", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Results_Ammos_AmmoId",
                        column: x => x.AmmoId,
                        principalTable: "Ammos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Results_Armors_ArmorId",
                        column: x => x.ArmorId,
                        principalTable: "Armors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Shots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ResultId = table.Column<int>(type: "INTEGER", nullable: false),
                    ShotNum = table.Column<int>(type: "INTEGER", nullable: false),
                    DurabilityPerc = table.Column<double>(type: "REAL", nullable: false),
                    Durability = table.Column<double>(type: "REAL", nullable: false),
                    DoneDamage = table.Column<double>(type: "REAL", nullable: false),
                    PenetrationChance = table.Column<double>(type: "REAL", nullable: false),
                    BluntDamage = table.Column<double>(type: "REAL", nullable: false),
                    PenetratingDamage = table.Column<double>(type: "REAL", nullable: false),
                    AverageDamage = table.Column<double>(type: "REAL", nullable: false),
                    RemainingHitPoints = table.Column<double>(type: "REAL", nullable: false),
                    ProbabilityOfKillCumulative = table.Column<double>(type: "REAL", nullable: false),
                    ProbabilityOfKillSpecific = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shots_Results_ResultId",
                        column: x => x.ResultId,
                        principalTable: "Results",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransmissionArmorTestShot",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DurabilityPerc = table.Column<double>(type: "REAL", nullable: false),
                    Durability = table.Column<double>(type: "REAL", nullable: false),
                    DoneDamage = table.Column<double>(type: "REAL", nullable: false),
                    PenetrationChance = table.Column<double>(type: "REAL", nullable: false),
                    BluntDamage = table.Column<double>(type: "REAL", nullable: false),
                    PenetratingDamage = table.Column<double>(type: "REAL", nullable: false),
                    AverageDamage = table.Column<double>(type: "REAL", nullable: false),
                    RemainingHitPoints = table.Column<double>(type: "REAL", nullable: false),
                    ProbabilityOfKillCumulative = table.Column<double>(type: "REAL", nullable: false),
                    ProbabilityOfKillSpecific = table.Column<double>(type: "REAL", nullable: false),
                    SQL_TBS_ResultId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransmissionArmorTestShot", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransmissionArmorTestShot_Results_SQL_TBS_ResultId",
                        column: x => x.SQL_TBS_ResultId,
                        principalTable: "Results",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Results_AmmoId",
                table: "Results",
                column: "AmmoId");

            migrationBuilder.CreateIndex(
                name: "IX_Results_ArmorId",
                table: "Results",
                column: "ArmorId");

            migrationBuilder.CreateIndex(
                name: "IX_Shots_ResultId",
                table: "Shots",
                column: "ResultId");

            migrationBuilder.CreateIndex(
                name: "IX_TransmissionArmorTestShot_SQL_TBS_ResultId",
                table: "TransmissionArmorTestShot",
                column: "SQL_TBS_ResultId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Shots");

            migrationBuilder.DropTable(
                name: "TransmissionArmorTestShot");

            migrationBuilder.DropTable(
                name: "Results");

            migrationBuilder.DropTable(
                name: "Ammos");

            migrationBuilder.DropTable(
                name: "Armors");
        }
    }
}
