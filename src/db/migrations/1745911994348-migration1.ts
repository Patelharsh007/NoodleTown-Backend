import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11745911994348 implements MigrationInterface {
    name = 'Migration11745911994348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_204e9b624861ff4a5b26819210"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_image" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_c9b5b525a96ddc2c5647d7f7fa" ON "users" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c9b5b525a96ddc2c5647d7f7fa"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_image"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userName" character varying(255)`);
        await queryRunner.query(`CREATE INDEX "IDX_204e9b624861ff4a5b26819210" ON "users" ("createdAt") `);
    }

}
