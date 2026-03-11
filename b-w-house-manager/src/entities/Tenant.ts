import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { User } from './User.ts';
import type { Warehouse } from './Warehouse.ts';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    name!: string;

    @Column({ name: 'subdomain', unique: true, nullable: true })
    subdomain?: string;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @Column({ name: 'stripe_customer_id', nullable: true })
    stripeCustomerId?: string;

    @Column({ name: 'subscription_status', nullable: true })
    subscriptionStatus?: string;

    @Column({ name: 'plan_id', nullable: true })
    planId?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany('User', 'tenant')
    users!: User[];

    @OneToMany('Warehouse', 'tenant')
    warehouses!: Warehouse[];
}
