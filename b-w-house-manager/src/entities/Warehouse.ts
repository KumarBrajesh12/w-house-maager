import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import type { Zone } from './Zone.ts';
import type { Tenant } from './Tenant.ts';

@Entity('warehouses')
export class Warehouse {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'tenant_id', nullable: true })
    tenantId?: string;

    @ManyToOne('Tenant', 'warehouses', { nullable: true })
    @JoinColumn({ name: 'tenant_id' })
    tenant?: Tenant;

    @Column()
    name!: string;

    @Column({ type: 'text' })
    location!: string;

    @Column({ type: 'numeric', name: 'total_capacity' })
    totalCapacity!: number;

    @OneToMany('Zone', 'warehouse')
    zones!: Zone[];
}
