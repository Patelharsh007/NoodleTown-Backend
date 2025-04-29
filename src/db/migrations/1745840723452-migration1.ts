import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11745840723452 implements MigrationInterface {
  name = "Migration11745840723452";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "userName" TO "user_name"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "user_name" TO "userName"`
    );
  }
}
