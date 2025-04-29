import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration71745923401604 implements MigrationInterface {
    name = 'Migration71745923401604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "PK_e6f830ac9b463433b58ad6f1a59"`);
        await queryRunner.query(`ALTER TABLE "meals" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "PK_ec3b6c29d2ab8ed7e8897a6fecd" PRIMARY KEY ("mealId")`);
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "UQ_ec3b6c29d2ab8ed7e8897a6fecd"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("mealId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4db846f11028bb406dd246c9579"`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "UQ_ec3b6c29d2ab8ed7e8897a6fecd" UNIQUE ("mealId")`);
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "PK_ec3b6c29d2ab8ed7e8897a6fecd"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4db846f11028bb406dd246c9579" FOREIGN KEY ("mealId") REFERENCES "meals"("mealId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meals" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "PK_e6f830ac9b463433b58ad6f1a59" PRIMARY KEY ("id")`);
    }

}
