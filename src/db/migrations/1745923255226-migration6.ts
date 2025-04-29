import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration61745923255226 implements MigrationInterface {
    name = 'Migration61745923255226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68"`);
        await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "FK_d0990061631440f3c14e12f95b5"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "PK_1b4e7ea0e70a11469cf3251ac7e" PRIMARY KEY ("restaurant_id")`);
        await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "UQ_1b4e7ea0e70a11469cf3251ac7e"`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "FK_d0990061631440f3c14e12f95b5" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "FK_d0990061631440f3c14e12f95b5"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "UQ_1b4e7ea0e70a11469cf3251ac7e" UNIQUE ("restaurant_id")`);
        await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "PK_1b4e7ea0e70a11469cf3251ac7e"`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "FK_d0990061631440f3c14e12f95b5" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("restaurant_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY ("id")`);
    }

}
