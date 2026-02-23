import type { Context } from 'hono';
import { ActivityLogService } from '../services/ActivityLogService.ts';

const activityService = new ActivityLogService();

export const getEntityTimeline = async (c: Context) => {
    try {
        const type = c.req.param('type');
        const id = c.req.param('id');
        const logs = await activityService.getLogsByEntity(type, id);
        return c.json(logs);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};
