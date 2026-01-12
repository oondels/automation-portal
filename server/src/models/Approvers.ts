import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ schema: 'automacao', name: 'approvers' })
export class Approver {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'bigint', unique: true })
  matricula!: string;

  @Column({ type: 'varchar' })
  usuario!: string;

  @Column({ name: 'unidade_dass', type: 'varchar', length: 20 })
  unidadeDass!: string;

  @Column({ type: 'varchar', length: 30 })
  role!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  permission?: string | null;
}