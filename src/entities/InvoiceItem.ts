import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Invoice } from './Invoice.ts';
import type { CustomerRental } from './CustomerRental.ts';

@Entity('invoice_items')
export class InvoiceItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'invoice_id' })
    invoiceId!: string;

    @ManyToOne('Invoice', 'items')
    @JoinColumn({ name: 'invoice_id' })
    invoice!: Invoice;

    @Column({ name: 'rental_id' })
    rentalId!: string;

    @ManyToOne('CustomerRental')
    @JoinColumn({ name: 'rental_id' })
    rental!: CustomerRental;

    @Column({ type: 'integer', name: 'days_charged' })
    daysCharged!: number;

    @Column({ type: 'numeric' })
    amount!: number;
}
