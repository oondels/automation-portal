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
import { ProjectUrgency, ProjectType, ProjectStatus, PauseRecord } from '../types/project';
import { OneToMany } from 'typeorm';
import { ProjectTimeline } from './ProjectTimeline';

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
  })
  startDate?: Date;

  @Column({ name: 'estimated_duration_time', type: 'interval', default: '00:00:00' })
  estimatedDurationTime?: string;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by', referencedColumnName: "matricula" })
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
    default: () => `'[]'`,
  })
  recordedPauses!: PauseRecord[];

  @ManyToOne(() => Team, team => team.projects, { nullable: true })
  @JoinColumn({ name: 'automation_team_id' })
  automationTeam?: Team;

  @Column({ name: 'concluded_at', type: 'timestamp', nullable: true })
  concludedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relation: project -> timeline entries
  @OneToMany(() => ProjectTimeline, timeline => timeline.project)
  timeline!: ProjectTimeline[];
}
