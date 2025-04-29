import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration111745925140066 implements MigrationInterface {
    name = 'Migration111745925140066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ALTER COLUMN "mealId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ALTER COLUMN "mealId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
