import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import type { Booking } from './Booking.ts';

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.PENDING,
    })
    status!: InvoiceStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    generatedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne('Booking', 'invoices')
    booking!: Booking;
}
