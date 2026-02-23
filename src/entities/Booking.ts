import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import type { User } from './User.ts';
import type { StorageUnit } from './StorageUnit.ts';
import type { Invoice } from './Invoice.ts';
import type { Item } from './Item.ts';

export enum BookingStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    itemsDescription!: string;

    @Column({ type: 'timestamp' })
    startDate!: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate?: Date;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.ACTIVE,
    })
    status!: BookingStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne('User', 'bookings')
    user!: User;

    @ManyToOne('StorageUnit', 'bookings')
    storageUnit!: StorageUnit;

    @OneToMany('Invoice', 'booking')
    invoices!: Invoice[];

    @OneToMany('Item', 'booking')
    items!: Item[];
}
