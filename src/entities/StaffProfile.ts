import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import type { User } from './User.ts';

@Entity('staff_profiles')
export class StaffProfile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id' })
    userId!: string;

    @OneToOne('User', 'staffProfile', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ nullable: true })
    designation?: string;

    @Column({ name: 'warehouse_id', nullable: true })
    warehouseId?: string;
}
