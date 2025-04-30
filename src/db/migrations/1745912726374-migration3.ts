import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration31745912726374 implements MigrationInterface {
  name = "Migration31745912726374";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderedAt"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "subTotal"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_2f7b2f69102d630fd08809c28a9"`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "stripePaymentId"`
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paymentStatus"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "ordered_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "sub_total" integer NOT NULL DEFAULT 0`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "stripe_payment_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_65204503e71840721aa296f5a82" UNIQUE ("stripe_payment_id")`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('pending', 'completed', 'failed')`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "payment_status" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'pending'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "payment_status"`
    );
    await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_65204503e71840721aa296f5a82"`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "stripe_payment_id"`
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "sub_total"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "ordered_at"`);
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('pending', 'completed', 'failed')`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'pending'`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "stripePaymentId" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_2f7b2f69102d630fd08809c28a9" UNIQUE ("stripePaymentId")`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "subTotal" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "orderedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
  }
}
