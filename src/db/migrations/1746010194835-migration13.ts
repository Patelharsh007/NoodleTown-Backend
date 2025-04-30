import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration131746010194835 implements MigrationInterface {
    name = 'Migration131746010194835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "timing"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD "open_time" TIME NOT NULL DEFAULT '11:00:00'`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD "close_time" TIME NOT NULL DEFAULT '19:00:00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "close_time"`);
        await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "open_time"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD "timing" character varying(255) NOT NULL`);
    }

}
