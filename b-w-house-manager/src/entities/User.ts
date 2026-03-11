import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import type { CustomerProfile } from './CustomerProfile.ts';
import type { StaffProfile } from './StaffProfile.ts';
import type { Tenant } from './Tenant.ts';

export enum UserRole {
    ADMIN = 'admin',
    EMPLOYEE = 'employee',
    USER = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'tenant_id', nullable: true })
    tenantId?: string;

    @ManyToOne('Tenant', 'users', { nullable: true })
    @JoinColumn({ name: 'tenant_id' })
    tenant?: Tenant;

    @Column({ unique: true })
    email!: string;

    @Column({ name: 'password_hash' })
    passwordHash!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToOne('CustomerProfile', 'user')
    customerProfile?: CustomerProfile;

    @OneToOne('StaffProfile', 'user')
    staffProfile?: StaffProfile;
}
