import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity({ schema: 'automacao', name: 'approvers' })
export class Approver {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'bigint', unique: true })
  matricula!: string;

  @OneToOne(() => User, user => user.approver)
  @JoinColumn({
    name: 'matricula',
    referencedColumnName: 'matricula'
  })
  user!: User;

  @Column({ type: 'varchar' })
  usuario!: string;

  @Column({ name: 'unidade_dass', type: 'varchar', length: 20 })
  unidadeDass!: string;

  @Column({ type: 'varchar', length: 30 })
  role!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  permission?: string | null;

  @Column({ type: 'boolean', default: true })
  active!: boolean
}