import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1784361025920 implements MigrationInterface {
    name = 'Init1784361025920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', "parentId" uuid, CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_c81ac541666ce5929a897b1bae5" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2547be0cdfeccb9221c68976fd" ON "menu_closure"  ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a0038e7e00bb09a06ba3b1131" ON "menu_closure"  ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_23ac1b81a7bfb85b14e86bd23a5" FOREIGN KEY ("parentId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_closure" ADD CONSTRAINT "FK_2547be0cdfeccb9221c68976fd7" FOREIGN KEY ("id_ancestor") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_closure" ADD CONSTRAINT "FK_6a0038e7e00bb09a06ba3b11319" FOREIGN KEY ("id_descendant") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_closure" DROP CONSTRAINT "FK_6a0038e7e00bb09a06ba3b11319"`);
        await queryRunner.query(`ALTER TABLE "menu_closure" DROP CONSTRAINT "FK_2547be0cdfeccb9221c68976fd7"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_23ac1b81a7bfb85b14e86bd23a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a0038e7e00bb09a06ba3b1131"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2547be0cdfeccb9221c68976fd"`);
        await queryRunner.query(`DROP TABLE "menu_closure"`);
        await queryRunner.query(`DROP TABLE "menu"`);
    }

}
