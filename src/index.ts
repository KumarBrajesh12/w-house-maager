import { Hono } from 'hono';
import { serve } from 'bun';
import pool from './config/database';

const app = new Hono();

app.get('/', (c) => {
    return c.json({
        message: 'Task Management API is running',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', async (c) => {
    try {
        const result = await pool.query('SELECT NOW()');
        return c.json({
            status: 'healthy',
            db: 'connected',
            time: result.rows[0].now
        });
    } catch (error) {
        return c.json({
            status: 'unhealthy',
            db: 'disconnected',
            error: error instanceof Error ? error.message : String(error)
        }, 500);
    }
});

const port = process.env.PORT || 3000;

console.log(`Server is running on http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
