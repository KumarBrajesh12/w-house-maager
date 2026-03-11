import api from '@/lib/axios';
import { Item, InventoryItem, RegisterItemDTO, StoreItemDTO } from '@/types/inventory';

export const inventoryService = {
    // Item Management
    async getItems(): Promise<Item[]> {
        return api.get('/items') as any;
    },

    async registerItem(data: RegisterItemDTO): Promise<Item> {
        return api.post('/inventory/register', data) as any;
    },

    // Inventory Management
    async getCustomerInventory(customerId: string): Promise<InventoryItem[]> {
        return api.get(`/inventory/customer/${customerId}`) as any;
    },

    async storeItem(data: StoreItemDTO): Promise<any> {
        return api.post('/inventory/store', data) as any;
    },
};
