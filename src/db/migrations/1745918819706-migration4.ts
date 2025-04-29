import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration41745918819706 implements MigrationInterface {
    name = 'Migration41745918819706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "itemName"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "itemTotal"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "item_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "item_total" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "item_total"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "item_name"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "itemTotal" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "itemName" character varying NOT NULL`);
    }

}
