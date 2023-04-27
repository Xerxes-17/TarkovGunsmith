using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WishGranter.Migrations.MonolitMigrations
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
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Penetration = table.Column<int>(type: "INTEGER", nullable: false),
                    ArmorDamage = table.Column<int>(type: "INTEGER", nullable: false),
                    Damage = table.Column<int>(type: "INTEGER", nullable: false),
                    InitialSpeed = table.Column<int>(type: "INTEGER", nullable: false),
                    BulletMass = table.Column<float>(type: "REAL", nullable: false),
                    BulletDiameterMillimeters = table.Column<float>(type: "REAL", nullable: false),
                    BallisticCoeficient = table.Column<float>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ammos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ArmorItems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    ArmorClass = table.Column<int>(type: "INTEGER", nullable: false),
                    ArmorMaterial = table.Column<int>(type: "INTEGER", nullable: false),
                    BluntThroughput = table.Column<float>(type: "REAL", nullable: false),
                    MaxDurability = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetZone = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArmorItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BallisticDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AmmoId = table.Column<string>(type: "TEXT", nullable: false),
                    Distance = table.Column<int>(type: "INTEGER", nullable: false),
                    Penetration = table.Column<float>(type: "decimal(18,3)", nullable: false),
                    Damage = table.Column<float>(type: "decimal(18,3)", nullable: false),
                    Speed = table.Column<float>(type: "decimal(18,3)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BallisticDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BallisticDetails_Ammos_AmmoId",
                        column: x => x.AmmoId,
                        principalTable: "Ammos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BallisticRatings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BallisticDetailsId = table.Column<int>(type: "INTEGER", nullable: false),
                    AC = table.Column<int>(type: "int", nullable: false),
                    ThoraxHTK_avg = table.Column<int>(type: "int", nullable: false),
                    HeadHTK_avg = table.Column<int>(type: "int", nullable: false),
                    LegHTK_avg = table.Column<int>(type: "int", nullable: false),
                    FirstHitPenChance = table.Column<float>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BallisticRatings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BallisticRatings_BallisticDetails_BallisticDetailsId",
                        column: x => x.BallisticDetailsId,
                        principalTable: "BallisticDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BallisticTests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ArmorId = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    DetailsId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartingDurabilityPerc = table.Column<float>(type: "decimal(18,3)", nullable: false),
                    ProbableKillShot = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BallisticTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BallisticTests_ArmorItems_ArmorId",
                        column: x => x.ArmorId,
                        principalTable: "ArmorItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BallisticTests_BallisticDetails_DetailsId",
                        column: x => x.DetailsId,
                        principalTable: "BallisticDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BallisticHits",
                columns: table => new
                {
                    TestId = table.Column<int>(type: "INTEGER", nullable: false),
                    HitNum = table.Column<int>(type: "INTEGER", nullable: false),
                    DurabilityBeforeHit = table.Column<double>(type: "decimal(18,3)", nullable: false),
                    DurabilityDamageTotalAfterHit = table.Column<double>(type: "decimal(18,3)", nullable: false),
                    PenetrationChance = table.Column<double>(type: "decimal(18,3)", nullable: false),
                    BluntDamage = table.Column<double>(type: "decimal(18,3)", nullable: false),
                    PenetrationDamage = table.Column<double>(type: "decimal(18,3)", nullable: false),
                    AverageRemainingHitPoints = table.Column<double>(type: "decimal(18,3)", nullable: false),
                    CumulativeChanceOfKill = table.Column<float>(type: "decimal(18,3)", nullable: false),
                    SpecificChanceOfKill = table.Column<float>(type: "decimal(18,3)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BallisticHits", x => new { x.TestId, x.HitNum });
                    table.ForeignKey(
                        name: "FK_BallisticHits_BallisticTests_TestId",
                        column: x => x.TestId,
                        principalTable: "BallisticTests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BallisticDetails_AmmoId",
                table: "BallisticDetails",
                column: "AmmoId");

            migrationBuilder.CreateIndex(
                name: "IX_BallisticDetails_Id_AmmoId_Distance",
                table: "BallisticDetails",
                columns: new[] { "Id", "AmmoId", "Distance" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BallisticHits_TestId_HitNum",
                table: "BallisticHits",
                columns: new[] { "TestId", "HitNum" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BallisticRatings_BallisticDetailsId",
                table: "BallisticRatings",
                column: "BallisticDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_BallisticRatings_Id_BallisticDetailsId_AC",
                table: "BallisticRatings",
                columns: new[] { "Id", "BallisticDetailsId", "AC" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BallisticTests_ArmorId",
                table: "BallisticTests",
                column: "ArmorId");

            migrationBuilder.CreateIndex(
                name: "IX_BallisticTests_DetailsId",
                table: "BallisticTests",
                column: "DetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_BallisticTests_Id_ArmorId_DetailsId",
                table: "BallisticTests",
                columns: new[] { "Id", "ArmorId", "DetailsId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BallisticHits");

            migrationBuilder.DropTable(
                name: "BallisticRatings");

            migrationBuilder.DropTable(
                name: "BallisticTests");

            migrationBuilder.DropTable(
                name: "ArmorItems");

            migrationBuilder.DropTable(
                name: "BallisticDetails");

            migrationBuilder.DropTable(
                name: "Ammos");
        }
    }
}
