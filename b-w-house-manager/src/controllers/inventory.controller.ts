import type { Context } from 'hono';
import { InventoryService } from '../services/InventoryService.ts';

const inventoryService = new InventoryService();

export const registerItem = async (c: Context) => {
    try {
        const tenantId = c.get('tenantId');
        const { customerId, name, description, category, declaredValue } = await c.req.json();
        const item = await inventoryService.registerItem(customerId, name, description, category, declaredValue, tenantId);
        return c.json(item, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const storeItem = async (c: Context) => {
    try {
        const { itemId, slotId, staffId } = await c.req.json();
        const storage = await inventoryService.storeItem(itemId, slotId, staffId);
        return c.json(storage, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const getCustomerInventory = async (c: Context) => {
    try {
        const tenantId = c.get('tenantId');
        const customerId = c.req.param('customerId');
        const inventory = await inventoryService.getCustomerInventory(customerId, tenantId);
        return c.json(inventory);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};
