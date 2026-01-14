import { MigrationInterface, QueryRunner } from "typeorm";

export class ApproverUserFK1768234189023 implements MigrationInterface {
    name = 'ApproverUserFK1768234189023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "automacao"."approvers" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "matricula" bigint NOT NULL, "usuario" character varying NOT NULL, "unidade_dass" character varying(20) NOT NULL, "role" character varying(30) NOT NULL, "permission" character varying(30), "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_f07af0536ebcfec3c9162fbda57" UNIQUE ("matricula"), CONSTRAINT "REL_f07af0536ebcfec3c9162fbda5" UNIQUE ("matricula"), CONSTRAINT "PK_b0f4069085419085b976501b1cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" DROP CONSTRAINT "FK_f74caab9e5649fdb4eb56f10aee"`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "estimated_duration_time" SET DEFAULT '0 days'`);
        await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" DROP CONSTRAINT "FK_86c25599a994d86993d58975740"`);
        await queryRunner.query(`ALTER TABLE "automacao"."team" DROP CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016"`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" DROP CONSTRAINT "user_unique"`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "createdat" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "updatedat" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "teste_calce" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "pense_aja" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "season" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "ambulatorio" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "limpeza" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" DROP CONSTRAINT "usuarios_email_key"`);
        await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" ADD CONSTRAINT "FK_bd845eff8afaaaa4736a57fbe16" FOREIGN KEY ("project_id") REFERENCES "automacao"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" ADD CONSTRAINT "FK_86c25599a994d86993d58975740" FOREIGN KEY ("user_register") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."approvers" ADD CONSTRAINT "FK_f07af0536ebcfec3c9162fbda57" FOREIGN KEY ("matricula") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "automacao"."team" ADD CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016" FOREIGN KEY ("registration") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "automacao"."team" DROP CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016"`);
      await queryRunner.query(`ALTER TABLE "automacao"."approvers" DROP CONSTRAINT "FK_f07af0536ebcfec3c9162fbda57"`);
      await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" DROP CONSTRAINT "FK_86c25599a994d86993d58975740"`);
      await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" DROP CONSTRAINT "FK_bd845eff8afaaaa4736a57fbe16"`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ADD CONSTRAINT "usuarios_email_key" UNIQUE ("email")`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "limpeza" SET DEFAULT '0'`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "ambulatorio" SET DEFAULT '0'`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "season" SET DEFAULT '0'`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "pense_aja" SET DEFAULT '0'`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "teste_calce" SET DEFAULT '0'`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "updatedat" DROP DEFAULT`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ALTER COLUMN "createdat" DROP DEFAULT`);
      await queryRunner.query(`ALTER TABLE "autenticacao"."usuarios" ADD CONSTRAINT "user_unique" UNIQUE ("id")`);
      await queryRunner.query(`ALTER TABLE "automacao"."team" ADD CONSTRAINT "FK_0b94d9750fb96f046fbe37cb016" FOREIGN KEY ("registration") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
      await queryRunner.query(`ALTER TABLE "automacao"."project_timeline" ADD CONSTRAINT "FK_86c25599a994d86993d58975740" FOREIGN KEY ("user_register") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
      await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "estimated_duration_time" SET DEFAULT '00:00:00'`);
      await queryRunner.query(`ALTER TABLE "automacao"."projects" ADD CONSTRAINT "FK_f74caab9e5649fdb4eb56f10aee" FOREIGN KEY ("requested_by") REFERENCES "autenticacao"."usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
      await queryRunner.query(`DROP TABLE "automacao"."approvers"`);
    }

}
