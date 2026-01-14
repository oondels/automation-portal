import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDefaults1768237714148 implements MigrationInterface {
    name = 'FixDefaults1768237714148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Remove a constraint antiga/errada de Projects (se ela existir)
        // O try/catch aqui é uma segurança caso ela já não exista mais

        // 2. Corrige o Default
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "estimated_duration_time" SET DEFAULT '0 days'`);
        
        // 3. Torna o campo nullable
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "requested_by" DROP NOT NULL`);

        // 4. CRIA A NOVA RELAÇÃO CORRETA (Usando apenas Matrícula)
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ADD CONSTRAINT "FK_f74caab9e5649fdb4eb56f10aee" FOREIGN KEY ("requested_by") REFERENCES "autenticacao"."usuarios"("matricula") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Desfaz as alterações
        await queryRunner.query(`ALTER TABLE "automacao"."projects" DROP CONSTRAINT "FK_f74caab9e5649fdb4eb56f10aee"`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "requested_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "automacao"."projects" ALTER COLUMN "estimated_duration_time" SET DEFAULT '00:00:00'`);
        
        // Tenta recriar a FK antiga (pode falhar se a estrutura de PK mudou, mas é o down)
        // await queryRunner.query(`ALTER TABLE "automacao"."projects" ADD CONSTRAINT "FK_819eb0710e2487334a9aa2a4d99" ...`); 
    }
}