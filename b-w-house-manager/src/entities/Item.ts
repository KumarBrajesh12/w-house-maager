import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { User } from './User.ts';
import type { ItemStorage } from './ItemStorage.ts';
import type { Tenant } from './Tenant.ts';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'tenant_id', nullable: true })
    tenantId?: string;

    @ManyToOne('Tenant', { nullable: true })
    @JoinColumn({ name: 'tenant_id' })
    tenant?: Tenant;

    @Column({ name: 'customer_id' })
    customerId!: string;

    @ManyToOne('User', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customer_id' })
    customer!: User;

    @Column()
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ nullable: true })
    category?: string;

    @Column({ type: 'numeric', name: 'declared_value', nullable: true })
    declaredValue?: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany('ItemStorage', 'item')
    storageHistory!: ItemStorage[];
}
