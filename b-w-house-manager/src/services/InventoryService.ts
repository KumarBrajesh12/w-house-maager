import { AppDataSource } from '../config/data-source.ts';
import { Item } from '../entities/Item.ts';
import { ItemStorage, ItemStorageStatus } from '../entities/ItemStorage.ts';
import { Slot, SlotStatus } from '../entities/Slot.ts';
import { InventoryMovement, MovementType } from '../entities/InventoryMovement.ts';
import { ActivityLogService } from './ActivityLogService.ts';

export class InventoryService {
    private itemRepository = AppDataSource.getRepository(Item);
    private itemStorageRepository = AppDataSource.getRepository(ItemStorage);
    private slotRepository = AppDataSource.getRepository(Slot);
    private movementRepository = AppDataSource.getRepository(InventoryMovement);
    private activityLogService = new ActivityLogService();

    async registerItem(customerId: string, name: string, description?: string, category?: string, declaredValue?: number, tenantId?: string) {
        const item = this.itemRepository.create({
            customerId,
            name,
            description,
            category,
            declaredValue,
            tenantId
        });
        const savedItem = await this.itemRepository.save(item);

        await this.activityLogService.log(
            customerId,
            'Item',
            savedItem.id,
            'REGISTER',
            { name, category }
        );

        return savedItem;
    }

    async storeItem(itemId: string, slotId: string, staffId: string) {
        return await AppDataSource.transaction(async transactionalEntityManager => {
            // Update Slot status
            await transactionalEntityManager.update(Slot, slotId, { status: SlotStatus.OCCUPIED });

            // Create ItemStorage record
            const storage = this.itemStorageRepository.create({
                itemId,
                slotId,
                status: ItemStorageStatus.ACTIVE,
                checkinDate: new Date()
            });
            const savedStorage = await transactionalEntityManager.save(ItemStorage, storage);

            // Log Movement
            const movementCorrect = new InventoryMovement();
            movementCorrect.itemId = itemId;
            movementCorrect.toSlotId = slotId;
            movementCorrect.movementType = MovementType.CHECKIN;
            movementCorrect.performedByStaffId = staffId;

            await transactionalEntityManager.save(InventoryMovement, movementCorrect);

            // Log Activity
            await this.activityLogService.log(
                staffId,
                'Item',
                itemId,
                'STORE',
                { slotId, storageId: savedStorage.id }
            );

            return savedStorage;
        });
    }

    async getCustomerInventory(customerId: string, tenantId: string) {
        return await this.itemRepository.find({
            where: { customerId, tenantId },
            relations: ['storageHistory', 'storageHistory.slot']
        });
    }
}
