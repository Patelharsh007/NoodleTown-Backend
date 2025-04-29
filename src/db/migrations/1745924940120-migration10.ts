import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration101745924940120 implements MigrationInterface {
    name = 'Migration101745924940120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "FK_a825123d8d5eb227cbffac51dea"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`);
        await queryRunner.query(`ALTER TABLE "meals" RENAME COLUMN "restaurantRestaurantId" TO "restaurantId"`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "FK_07f3d5022b83a5a4f72ab9a74d9" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`);
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "FK_07f3d5022b83a5a4f72ab9a74d9"`);
        await queryRunner.query(`ALTER TABLE "meals" RENAME COLUMN "restaurantId" TO "restaurantRestaurantId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "FK_a825123d8d5eb227cbffac51dea" FOREIGN KEY ("restaurantRestaurantId") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
