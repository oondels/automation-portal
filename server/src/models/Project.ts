import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';
import { Team } from './Team';

export enum ProjectUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ProjectStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum ProjectType {
  APP_DEVELOPMENT = 'app_development',
  PROCESS_AUTOMATION = 'process_automation',
  APP_IMPROVEMENT = 'app_improvement',
  APP_FIX = 'app_fix',
  METALWORK = 'metalwork', // serralheria
  CARPENTRY = 'carpentry', // marcenaria
}

@Entity({ schema: 'automacao', name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'project_name', type: 'text' })
  projectName!: string;

  @Column({ type: 'varchar' })
  sector!: string;

  @Column({
    type: 'enum',
    enum: ProjectUrgency,
    default: ProjectUrgency.LOW,
  })
  urgency!: ProjectUrgency;

  @Column({
    type: 'enum',
    enum: ProjectType,
    name: 'project_type',
    default: ProjectType.APP_DEVELOPMENT,
  })
  projectType!: ProjectType;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  startdate?: Date;

  @Column({ name: 'estimated_end_date', type: 'timestamp' })
  estimatedEndDate!: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.REQUESTED,
  })
  status!: ProjectStatus;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    name: 'expected_gains',
    type: 'jsonb',
    nullable: true,
    default: () => `'[]'`,
  })
  expectedGains!: string[];

  @Column({
    name: 'project_tags',
    type: 'jsonb',
    nullable: true,
    default: () => `'[]'`,
  })
  projectTags?: string[];

  @Column({
    name: 'pictures',
    type: 'jsonb',
    nullable: true,
    default: () => `'[]'`,
  })
  pictures?: string[];

  @ManyToOne(() => User, user => user.requestedProjects, { nullable: false })
  @JoinColumn({ name: 'requested_by' })
  requestedBy!: User;

  @Column({ name: 'approved_by', type: 'varchar', nullable: true })
  approvedBy?: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ name: 'pausedat', type: 'timestamp', nullable: true })
  pausedAt?: Date;

  @Column({
    name: 'recorded_pauses',
    type: 'jsonb',
    nullable: true,
    default: () => `'[]'`,
  })
  recordedPauses!: Date[];

  @ManyToOne(() => Team, team => team.projects, { nullable: false })
  @JoinColumn({ name: 'automation_team_id' })
  automationTeam!: Team;

  @Column({ name: 'concluded_at', type: 'timestamp', nullable: true })
  concludedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
