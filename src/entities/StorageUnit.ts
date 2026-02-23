import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Booking } from './Booking.ts';

@Entity('storage_units')
export class StorageUnit {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    type!: string; // e.g., 'Small', 'Medium', 'Large'

    @Column('float')
    capacity!: number; // in square meters or cubic meters

    @Column('decimal', { precision: 10, scale: 2 })
    pricePerDay!: number;

    @Column({ default: true })
    isAvailable!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany('Booking', 'storageUnit')
    bookings!: Booking[];
}
