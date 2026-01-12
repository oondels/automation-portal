import {
Entity,
PrimaryGeneratedColumn,
Column
} from "typeorm";

@Entity({ schema: 'autenticacao', name: 'emails' })
export class NotificationEmail {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint' })
  matricula!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  confirmed?: boolean;

  @Column({ name: 'unidade_dass', type: 'varchar', length: 10, nullable: true })
  unidadeDass?: string;

  @Column({ name: 'authorized_notifications_apps', type: 'jsonb', nullable: true })
  authorizedNotificationsApps?: Record<string, any>;
}