import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Item } from './Item.ts';
import type { Slot } from './Slot.ts';
import type { User } from './User.ts';

export enum MovementType {
    CHECKIN = 'checkin',
    RELOCATE = 'relocate',
    CHECKOUT = 'checkout',
}

@Entity('inventory_movements')
export class InventoryMovement {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'item_id' })
    itemId!: string;

    @ManyToOne('Item')
    @JoinColumn({ name: 'item_id' })
    item!: Item;

    @Column({ name: 'from_slot', nullable: true })
    fromSlotId?: string;

    @ManyToOne('Slot')
    @JoinColumn({ name: 'from_slot' })
    fromSlot?: Slot;

    @Column({ name: 'to_slot', nullable: true })
    toSlotId?: string;

    @ManyToOne('Slot')
    @JoinColumn({ name: 'to_slot' })
    toSlot?: Slot;

    @Column({
        type: 'enum',
        enum: MovementType,
    })
    movementType!: MovementType;

    @Column({ name: 'performed_by' })
    performedByStaffId!: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'performed_by' })
    performedByStaff!: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
