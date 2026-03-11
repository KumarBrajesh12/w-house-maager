import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Order } from './Order.ts';
import type { Item } from './Item.ts';
import type { Slot } from './Slot.ts';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'order_id' })
    orderId!: string;

    @ManyToOne('Order', 'items')
    @JoinColumn({ name: 'order_id' })
    order!: Order;

    @Column({ name: 'item_id' })
    itemId!: string;

    @ManyToOne('Item')
    @JoinColumn({ name: 'item_id' })
    item!: Item;

    @Column({ name: 'assigned_slot', nullable: true })
    assignedSlotId?: string;

    @ManyToOne('Slot')
    @JoinColumn({ name: 'assigned_slot' })
    assignedSlot?: Slot;
}
