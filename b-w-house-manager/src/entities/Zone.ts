import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { Warehouse } from './Warehouse.ts';
import type { Rack } from './Rack.ts';

@Entity('zones')
export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'warehouse_id' })
    warehouseId!: string;

    @ManyToOne('Warehouse', 'zones', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouse_id' })
    warehouse!: Warehouse;

    @Column()
    name!: string;

    @OneToMany('Rack', 'zone')
    racks!: Rack[];
}
