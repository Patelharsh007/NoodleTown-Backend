import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration51745920412188 implements MigrationInterface {
  name = "Migration51745920412188";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meals" DROP CONSTRAINT "FK_07f3d5022b83a5a4f72ab9a74d9"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" DROP CONSTRAINT "UQ_705b3b16123dbc65824c92f4265" CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "restaurantId" TO "restaurant_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "posterImages" TO "poster_images"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "avgCostPerPerson" TO "avg_cost_per_person"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "isOpen" TO "is_open"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "menuImages" TO "menu_images"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "isFeatured" TO "is_featured"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD CONSTRAINT "UQ_1b4e7ea0e70a11469cf3251ac7e" UNIQUE ("restaurant_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "restaurantId" TO "restaurant_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "meals" ADD CONSTRAINT "FK_07f3d5022b83a5a4f72ab9a74d9" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meals" DROP CONSTRAINT "FK_07f3d5022b83a5a4f72ab9a74d9"`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" RENAME COLUMN "restaurant_id" TO "restaurantId"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" DROP CONSTRAINT "UQ_1b4e7ea0e70a11469cf3251ac7e"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "is_featured" TO "isFeatured"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "menu_images" TO "menuImages"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "is_open" TO "isOpen"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "avg_cost_per_person" TO "avgCostPerPerson"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "poster_images" TO "posterImages"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" RENAME COLUMN "restaurant_id" TO "restaurantId"`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD CONSTRAINT "UQ_705b3b16123dbc65824c92f4265" UNIQUE ("restaurantId")`
    );
    await queryRunner.query(
      `ALTER TABLE "meals" ADD CONSTRAINT "FK_07f3d5022b83a5a4f72ab9a74d9" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("restaurantId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
