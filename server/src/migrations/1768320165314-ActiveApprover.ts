import { MigrationInterface, QueryRunner } from "typeorm";

export class ActiveApprover1768320165314 implements MigrationInterface {
    name = 'ActiveApprover1768320165314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automacao"."approvers" ADD "active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automacao"."approvers" DROP COLUMN "active"`);
    }

}
