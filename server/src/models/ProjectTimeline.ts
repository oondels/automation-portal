import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

@Entity({ schema: 'automacao', name: 'project_timeline' })
export class ProjectTimeline {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, project => project.timeline, { nullable: false })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project!: Project;

  // Relaciona ao usuário via matrícula (user.matricula)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_register', referencedColumnName: 'matricula' })
  user!: User;

  @Column({ name: 'event_type', type: 'varchar', length: 32 })
  eventType!: string;

  @Column({ name: 'event_description', type: 'text' })
  eventDescription!: string;

  @Column({ name: 'old_status', type: 'varchar', length: 30, nullable: true })
  oldStatus?: string;

  @Column({ name: 'new_status', type: 'varchar', length: 30 })
  newStatus!: string;

  @Column({ name: 'payload', type: 'jsonb', nullable: true, default: () => `'{}'` })
  payload?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt!: Date;
}

