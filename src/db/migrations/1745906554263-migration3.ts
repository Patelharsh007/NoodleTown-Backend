import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration31745906554263 implements MigrationInterface {
    name = 'Migration31745906554263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "user_name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "user_name" DROP NOT NULL`);
    }

}
