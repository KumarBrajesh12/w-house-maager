import { Hono } from 'hono';
import { AppDataSource } from './config/data-source';

const app = new Hono();

// Initialize Data Source
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

app.get('/', (c) => {
    return c.json({
        message: 'Task Management API is running',
        status: 'ok',
        orm: 'TypeORM',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', async (c) => {
    try {
        const isInitialized = AppDataSource.isInitialized;
        if (!isInitialized) {
            throw new Error("Data Source is not initialized");
        }

        // Check DB connection
        await AppDataSource.query('SELECT 1');

        return c.json({
            status: 'healthy',
            db: 'connected',
            orm: 'initialized'
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
