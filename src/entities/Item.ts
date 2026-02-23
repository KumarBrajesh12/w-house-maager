import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import type { Booking } from './Booking.ts';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: 'int', default: 1 })
    quantity!: number;

    @Column({ type: 'float', nullable: true })
    weight?: number; // in kg

    @Column({ type: 'varchar', nullable: true })
    dimensions?: string; // e.g., '10x10x10 cm'

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne('Booking', 'items')
    booking!: Booking;
}
