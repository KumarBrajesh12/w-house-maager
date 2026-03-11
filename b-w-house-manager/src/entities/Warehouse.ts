import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Zone } from './Zone.ts';

@Entity('warehouses')
export class Warehouse {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ type: 'text' })
    location!: string;

    @Column({ type: 'numeric', name: 'total_capacity' })
    totalCapacity!: number;

    @OneToMany('Zone', 'warehouse')
    zones!: Zone[];
}
