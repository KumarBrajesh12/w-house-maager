import type { Context } from 'hono';
import { WarehouseService } from '../services/WarehouseService.ts';

const warehouseService = new WarehouseService();

export const createWarehouse = async (c: Context) => {
    try {
        const { name, location, totalCapacity } = await c.req.json();
        const warehouse = await warehouseService.createWarehouse(name, location, totalCapacity);
        return c.json(warehouse, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const addZone = async (c: Context) => {
    try {
        const warehouseId = c.req.param('warehouseId');
        const { name } = await c.req.json();
        const zone = await warehouseService.addZone(warehouseId, name);
        return c.json(zone, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const addRack = async (c: Context) => {
    try {
        const zoneId = c.req.param('zoneId');
        const { code } = await c.req.json();
        const rack = await warehouseService.addRack(zoneId, code);
        return c.json(rack, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const addSlot = async (c: Context) => {
    try {
        const rackId = c.req.param('rackId');
        const { sizeType, volume } = await c.req.json();
        const slot = await warehouseService.addSlot(rackId, sizeType, volume);
        return c.json(slot, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const getWarehouseHierarchy = async (c: Context) => {
    try {
        const warehouseId = c.req.param('warehouseId');
        const hierarchy = await warehouseService.getWarehouseHierarchy(warehouseId);
        if (!hierarchy) return c.json({ error: 'Warehouse not found' }, 404);
        return c.json(hierarchy);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const getAllWarehouses = async (c: Context) => {
    try {
        const warehouses = await warehouseService.getAllWarehouses();
        return c.json(warehouses);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};
