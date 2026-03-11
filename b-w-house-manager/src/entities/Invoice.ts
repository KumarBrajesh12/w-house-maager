import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { User } from './User.ts';
import type { InvoiceItem } from './InvoiceItem.ts';

export enum InvoiceStatus {
    PAID = 'paid',
    UNPAID = 'unpaid',
    OVERDUE = 'overdue',
}

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'customer_id' })
    customerId!: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'customer_id' })
    customer!: User;

    @Column({ type: 'date', name: 'billing_period_start' })
    billingPeriodStart!: Date;

    @Column({ type: 'date', name: 'billing_period_end' })
    billingPeriodEnd!: Date;

    @Column({ type: 'numeric', name: 'total_amount' })
    totalAmount!: number;

    @Column({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.UNPAID,
    })
    status!: InvoiceStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany('InvoiceItem', 'invoice')
    items!: InvoiceItem[];
}
