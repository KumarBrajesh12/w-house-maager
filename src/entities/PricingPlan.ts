import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SlotSizeType } from './Slot.ts';

@Entity('pricing_plans')
export class PricingPlan {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        name: 'size_type',
        type: 'enum',
        enum: SlotSizeType,
    })
    sizeType!: SlotSizeType;

    @Column({ type: 'numeric', name: 'price_per_day' })
    pricePerDay!: number;
}
