import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { Zone } from './Zone.ts';
import type { Slot } from './Slot.ts';

@Entity('racks')
export class Rack {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'zone_id' })
    zoneId!: string;

    @ManyToOne('Zone', 'racks', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'zone_id' })
    zone!: Zone;

    @Column()
    code!: string;

    @OneToMany('Slot', 'rack')
    slots!: Slot[];
}
