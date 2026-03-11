import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { User } from './User.ts';
import type { OrderItem } from './OrderItem.ts';

export enum OrderType {
    STORE = 'store',
    REMOVE = 'remove',
    MOVE = 'move',
}

export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'customer_id' })
    customerId!: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'customer_id' })
    customer!: User;

    @Column({
        type: 'enum',
        enum: OrderType,
    })
    orderType!: OrderType;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status!: OrderStatus;

    @Column({ name: 'created_by' })
    createdByStaffId!: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'created_by' })
    createdByStaff!: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @OneToMany('OrderItem', 'order')
    items!: OrderItem[];
}
