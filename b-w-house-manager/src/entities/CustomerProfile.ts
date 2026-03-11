import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import type { User } from './User.ts';

@Entity('customer_profiles')
export class CustomerProfile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id' })
    userId!: string;

    @OneToOne('User', 'customerProfile', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'company_name', nullable: true })
    companyName?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({
        name: 'billing_cycle',
        type: 'enum',
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    })
    billingCycle!: string;
}
