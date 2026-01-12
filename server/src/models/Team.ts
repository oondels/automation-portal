// src/entities/team.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './User';
import { Project } from './Project';

@Entity({ name: 'team', schema: 'automacao' })
@Unique('team_registration_rfid_barcode_key', ['registration', 'rfid', 'barcode'])
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', type: 'text' })
  name!: string;

  @Column({ type: 'bigint' })
  registration!: string;

  @Column({ type: 'bigint' })
  rfid!: number;

  @Column({ type: 'bigint' })
  barcode!: number;

  @Column({ type: 'varchar', length: 50 })
  username!: string;

  @Column({ name: 'unidade_dass', type: 'varchar', length: 50, default: 'SEST' })
  unidadeDass!: string;

  @Column({ name: 'role', type: 'varchar', length: 50, default: 'intern' })
  role!: string;

  @Column({ name: 'level', type: 'varchar', length: 10, default: 'C' })
  level!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.teams, { nullable: false })
  @JoinColumn({ name: 'registration', referencedColumnName: 'matricula' })
  registrationUser!: User;

  @OneToMany(() => Project, project => project.automationTeam)
  projects!: Project[];
}
