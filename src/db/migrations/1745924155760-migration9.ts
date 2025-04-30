import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration91745924155760 implements MigrationInterface {
  name = "Migration91745924155760";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "mealId" TO "id"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "shortDescription" TO "short_description"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "fullDescription" TO "full_description"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "isPopular" TO "is_popular"`
    );

    // Remove this line if the column does not exist
    // await queryRunner.query(`ALTER TABLE "meals" DROP COLUMN "restaurantId"`);

    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "restaurant_id" TO "id"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME CONSTRAINT "PK_1b4e7ea0e70a11469cf3251ac7e" TO "PK_e2133a72eb1cc8f588f7b503e68"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME CONSTRAINT "PK_ec3b6c29d2ab8ed7e8897a6fecd" TO "PK_e6f830ac9b463433b58ad6f1a59"`
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME CONSTRAINT "PK_e6f830ac9b463433b58ad6f1a59" TO "PK_ec3b6c29d2ab8ed7e8897a6fecd"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" TO "PK_1b4e7ea0e70a11469cf3251ac7e"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "id" TO "restaurant_id"`
    );

    // Re-add the restaurantId column if needed
    await queryRunner.query(
      `ALTER TABLE "meals" ADD COLUMN "restaurantId" varchar`
    );

    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "is_popular" TO "isPopular"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "full_description" TO "fullDescription"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "short_description" TO "shortDescription"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "id" TO "mealId"`
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("mealId") ON DELETE CASCADE`
    );
  }
}
