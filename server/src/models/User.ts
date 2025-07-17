// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Team } from './Team';
import { Project } from './Project';

@Entity({ name: 'usuarios', schema: 'autenticacao' })
@Index('user_registration_unique', ['matricula'], { unique: true })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @CreateDateColumn({ name: 'createdat', type: 'timestamptz', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedat', type: 'timestamptz', nullable: true })
  updatedAt!: Date;

  @Column({ name: 'codigo_barras', type: 'bigint' })
  codigoBarras!: string;

  @Column({ type: 'bigint', unique: true })
  matricula!: string;

  @Column({ type: 'varchar', nullable: true })
  nome!: string;

  @Column({ name: 'usuario', type: 'varchar', nullable: true })
  usuario!: string;

  @Column({ type: 'varchar', nullable: true })
  senha!: string;

  @Column({ type: 'varchar', nullable: true })
  funcao!: string;

  @Column({ type: 'varchar', nullable: true })
  setor!: string;

  @Column({ name: 'teste_calce', type: 'integer', default: () => '0', nullable: true })
  testeCalce!: number;

  @Column({ name: 'pense_aja', type: 'integer', default: () => '0', nullable: true })
  penseAja!: number;

  @Column({ type: 'integer', default: () => '0', nullable: true })
  season!: number;

  @Column({ type: 'integer', default: () => '0', nullable: true })
  ambulatorio!: number;

  @Column({ type: 'integer', default: () => '0', nullable: true })
  limpeza!: number;

  @Column({ type: 'integer', nullable: true })
  telas!: number;

  @Column({ type: 'varchar', nullable: true })
  unidade!: string;

  @Column({ type: 'varchar', nullable: true })
  nivel!: string;

  @Column({ name: 'pe_confirmado', type: 'integer', nullable: true })
  peConfirmado!: number;

  @Column({ type: 'bigint', nullable: true })
  rfid!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string;

  @OneToMany(() => Team, team => team.registrationUser)
  teams!: Team[];

  @OneToMany(() => Project, project => project.requestedBy)
  requestedProjects!: Project[];
}
