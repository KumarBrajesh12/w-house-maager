import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Rack } from './Rack.ts';

export enum SlotSizeType {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

export enum SlotStatus {
    AVAILABLE = 'available',
    OCCUPIED = 'occupied',
    MAINTENANCE = 'maintenance',
}

@Entity('slots')
export class Slot {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'rack_id' })
    rackId!: string;

    @ManyToOne('Rack', 'slots', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rack_id' })
    rack!: Rack;

    @Column({
        name: 'size_type',
        type: 'enum',
        enum: SlotSizeType,
    })
    sizeType!: SlotSizeType;

    @Column({ type: 'numeric' })
    volume!: number;

    @Column({
        type: 'enum',
        enum: SlotStatus,
        default: SlotStatus.AVAILABLE,
    })
    status!: SlotStatus;
}
