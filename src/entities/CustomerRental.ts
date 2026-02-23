import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './User.ts';
import type { Item } from './Item.ts';
import type { Slot } from './Slot.ts';
import type { PricingPlan } from './PricingPlan.ts';

@Entity('customer_rentals')
export class CustomerRental {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'customer_id' })
    customerId!: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'customer_id' })
    customer!: User;

    @Column({ name: 'item_id' })
    itemId!: string;

    @ManyToOne('Item')
    @JoinColumn({ name: 'item_id' })
    item!: Item;

    @Column({ name: 'slot_id' })
    slotId!: string;

    @ManyToOne('Slot')
    @JoinColumn({ name: 'slot_id' })
    slot!: Slot;

    @Column({ name: 'pricing_plan_id' })
    pricingPlanId!: string;

    @ManyToOne('PricingPlan')
    @JoinColumn({ name: 'pricing_plan_id' })
    pricingPlan!: PricingPlan;

    @Column({ type: 'timestamp', name: 'start_date' })
    startDate!: Date;

    @Column({ type: 'timestamp', name: 'end_date', nullable: true })
    endDate?: Date;
}
