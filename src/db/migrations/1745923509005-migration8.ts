import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration81745923509005 implements MigrationInterface {
    name = 'Migration81745923509005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "FK_d0990061631440f3c14e12f95b5"`);
        await queryRunner.query(`ALTER TABLE "meals" RENAME COLUMN "restaurant_id" TO "restaurantRestaurantId"`);
        await queryRunner.query(`ALTER TABLE "meals" ALTER COLUMN "restaurantRestaurantId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "FK_a825123d8d5eb227cbffac51dea" FOREIGN KEY ("restaurantRestaurantId") REFERENCES "restaurants"("restaurant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "FK_a825123d8d5eb227cbffac51dea"`);
        await queryRunner.query(`ALTER TABLE "meals" ALTER COLUMN "restaurantRestaurantId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meals" RENAME COLUMN "restaurantRestaurantId" TO "restaurant_id"`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "FK_d0990061631440f3c14e12f95b5" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
