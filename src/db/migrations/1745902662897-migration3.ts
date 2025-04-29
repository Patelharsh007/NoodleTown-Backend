import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration31745902662897 implements MigrationInterface {
  name = "Migration31745902662897";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "UQ_d4dcd5f45ec24e89c5f60e805c8"`
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" RENAME COLUMN "recipientName" TO "name"`
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "UQ_8004b7d8f1d56ede02a4c333f06" UNIQUE ("userId", "name", "street", "city", "state", "pincode", "country")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "UQ_8004b7d8f1d56ede02a4c333f06"`
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" RENAME COLUMN "name" TO "recipientName"`
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "UQ_d4dcd5f45ec24e89c5f60e805c8" UNIQUE ("city", "country", "pincode", "recipientName", "state", "street", "userId")`
    );
  }
}
