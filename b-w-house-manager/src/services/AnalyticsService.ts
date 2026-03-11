import { AppDataSource } from '../config/data-source.ts';
import { Slot, SlotStatus } from '../entities/Slot.ts';
import { Item } from '../entities/Item.ts';
import { Invoice } from '../entities/Invoice.ts';

export class AnalyticsService {
    private slotRepository = AppDataSource.getRepository(Slot);
    private itemRepository = AppDataSource.getRepository(Item);
    private invoiceRepository = AppDataSource.getRepository(Invoice);

    async getWarehouseUtilization() {
        const totalSlots = await this.slotRepository.count();
        const occupiedSlots = await this.slotRepository.count({ where: { status: SlotStatus.OCCUPIED } });

        return {
            totalSlots,
            occupiedSlots,
            utilizationPercentage: totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0
        };
    }

    async getRevenueReport() {
        const revenue = await this.invoiceRepository
            .createQueryBuilder("invoice")
            .select("SUM(invoice.totalAmount)", "total")
            .where("invoice.status = :status", { status: 'paid' })
            .getRawOne();

        return {
            totalRevenue: Number(revenue.total) || 0
        };
    }

    async getCustomerGrowth() {
        // Simplified: items per month
        const growth = await this.itemRepository
            .createQueryBuilder("item")
            .select("DATE_TRUNC('month', item.createdAt)", "month")
            .addSelect("COUNT(*)", "count")
            .groupBy("month")
            .orderBy("month", "ASC")
            .getRawMany();

        return growth;
    }
}
