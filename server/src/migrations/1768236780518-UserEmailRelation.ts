import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEmailRelation1768236780518 implements MigrationInterface {
    name = 'UserEmailRelation1768236780518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "estimated_duration_time" SET DEFAULT '0 days'`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."emails" ALTER COLUMN "matricula" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."emails" ADD CONSTRAINT "UQ_d21ec11d2bcffaeb799fd1e6878" UNIQUE ("matricula")`);
        await queryRunner.query(`ALTER TABLE "automacao"."team" DROP CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016"`);
        await queryRunner.query(`ALTER TABLE "automacao"."approvers" DROP CONSTRAINT "FK_f07af0536ebcfec3c9162fbda57"`);
        await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" DROP CONSTRAINT "FK_86c25599a994d86993d58975740"`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" DROP CONSTRAINT "FK_819eb0710e2487334a9aa2a4d99"`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "teste_calce" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "pense_aja" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "season" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "ambulatorio" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "limpeza" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" ADD CONSTRAINT "FK_86c25599a994d86993d58975740" FOREIGN KEY ("user_register") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ADD CONSTRAINT "FK_819eb0710e2487334a9aa2a4d99" FOREIGN KEY ("requested_by", "requested_by", "requested_by") REFERENCES "autenticacao"."usuarios"("id","codigo_barras","matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."team" ADD CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016" FOREIGN KEY ("registration") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."approvers" ADD CONSTRAINT "FK_f07af0536ebcfec3c9162fbda57" FOREIGN KEY ("matricula") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."emails" ADD CONSTRAINT "FK_d21ec11d2bcffaeb799fd1e6878" FOREIGN KEY ("matricula") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autenticacao"."emails" DROP CONSTRAINT "FK_d21ec11d2bcffaeb799fd1e6878"`);
        await queryRunner.query(`ALTER TABLE "automacao"."approvers" DROP CONSTRAINT "FK_f07af0536ebcfec3c9162fbda57"`);
        await queryRunner.query(`ALTER TABLE "automacao"."team" DROP CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016"`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" DROP CONSTRAINT "FK_819eb0710e2487334a9aa2a4d99"`);
        await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" DROP CONSTRAINT "FK_86c25599a994d86993d58975740"`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "limpeza" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "ambulatorio" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "season" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "pense_aja" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "teste_calce" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ADD CONSTRAINT "FK_819eb0710e2487334a9aa2a4d99" FOREIGN KEY ("requested_by", "requested_by", "requested_by") REFERENCES "autenticacao"."usuarios"("matricula","codigo_barras","id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" ADD CONSTRAINT "FK_86c25599a994d86993d58975740" FOREIGN KEY ("user_register") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."approvers" ADD CONSTRAINT "FK_f07af0536ebcfec3c9162fbda57" FOREIGN KEY ("matricula") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."team" ADD CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016" FOREIGN KEY ("registration") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."emails" DROP CONSTRAINT "UQ_d21ec11d2bcffaeb799fd1e6878"`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."emails" ALTER COLUMN "matricula" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "estimated_duration_time" SET DEFAULT '00:00:00'`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ADD "email" character varying(255)`);
    }

}
