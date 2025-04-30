import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration121745996084649 implements MigrationInterface {
    name = 'Migration121745996084649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coupons" ("id" SERIAL NOT NULL, "coupon_code" character varying(255) NOT NULL, "amount" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_c8818df7c5fc8ef75a2eecee6a6" UNIQUE ("coupon_code"), CONSTRAINT "UQ_adbb59929bdc370b6e567249f55" UNIQUE ("amount"), CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "coupons"`);
    }

}
