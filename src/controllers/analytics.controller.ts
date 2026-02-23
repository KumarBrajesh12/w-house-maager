import type { Context } from 'hono';
import { AnalyticsService } from '../services/AnalyticsService.ts';

const analyticsService = new AnalyticsService();

export const getWarehouseUtilization = async (c: Context) => {
    try {
        const stats = await analyticsService.getWarehouseUtilization();
        return c.json(stats);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const getRevenueReport = async (c: Context) => {
    try {
        const report = await analyticsService.getRevenueReport();
        return c.json(report);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const getCustomerGrowth = async (c: Context) => {
    try {
        const growth = await analyticsService.getCustomerGrowth();
        return c.json(growth);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};
