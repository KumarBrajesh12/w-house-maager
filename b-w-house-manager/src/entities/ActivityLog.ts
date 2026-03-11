import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './User.ts';

@Entity('activity_logs')
export class ActivityLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'entity_type' })
    entityType!: string;

    @Column({ name: 'entity_id' })
    entityId!: string;

    @Column()
    action!: string;

    @Column({ name: 'performed_by' })
    performedByUserId!: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'performed_by' })
    performedBy!: User;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
