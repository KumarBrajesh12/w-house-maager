import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Item } from './Item.ts';
import type { Slot } from './Slot.ts';

export enum ItemStorageStatus {
    ACTIVE = 'active',
    REMOVED = 'removed',
}

@Entity('item_storage')
export class ItemStorage {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'item_id' })
    itemId!: string;

    @ManyToOne('Item', 'storageHistory')
    @JoinColumn({ name: 'item_id' })
    item!: Item;

    @Column({ name: 'slot_id' })
    slotId!: string;

    @ManyToOne('Slot')
    @JoinColumn({ name: 'slot_id' })
    slot!: Slot;

    @Column({ type: 'timestamp', name: 'checkin_date', default: () => 'CURRENT_TIMESTAMP' })
    checkinDate!: Date;

    @Column({ type: 'timestamp', name: 'checkout_date', nullable: true })
    checkoutDate?: Date;

    @Column({
        type: 'enum',
        enum: ItemStorageStatus,
        default: ItemStorageStatus.ACTIVE,
    })
    status!: ItemStorageStatus;
}
