import { AppDataSource } from '../config/data-source.ts';
import { Warehouse } from '../entities/Warehouse.ts';
import { Zone } from '../entities/Zone.ts';
import { Rack } from '../entities/Rack.ts';
import { Slot, SlotSizeType } from '../entities/Slot.ts';

export class WarehouseService {
    private warehouseRepository = AppDataSource.getRepository(Warehouse);
    private zoneRepository = AppDataSource.getRepository(Zone);
    private rackRepository = AppDataSource.getRepository(Rack);
    private slotRepository = AppDataSource.getRepository(Slot);

    async createWarehouse(name: string, location: string, totalCapacity: number) {
        const warehouse = this.warehouseRepository.create({ name, location, totalCapacity });
        return await this.warehouseRepository.save(warehouse);
    }

    async addZone(warehouseId: string, name: string) {
        const zone = this.zoneRepository.create({ warehouseId, name });
        return await this.zoneRepository.save(zone);
    }

    async addRack(zoneId: string, code: string) {
        const rack = this.rackRepository.create({ zoneId, code });
        return await this.rackRepository.save(rack);
    }

    async addSlot(rackId: string, sizeType: SlotSizeType, volume: number) {
        const slot = this.slotRepository.create({ rackId, sizeType, volume });
        return await this.slotRepository.save(slot);
    }

    async getWarehouseHierarchy(warehouseId: string) {
        return await this.warehouseRepository.findOne({
            where: { id: warehouseId },
            relations: ['zones', 'zones.racks', 'zones.racks.slots']
        });
    }

    async getAllWarehouses() {
        return await this.warehouseRepository.find();
    }
}
