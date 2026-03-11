import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import { AppDataSource } from './config/data-source.ts';
import authRoutes from './routes/auth.routes.ts';
import userRoutes from './routes/user.routes.ts';
import warehouseRoutes from './routes/warehouse.routes.ts';
import orderRoutes from './routes/order.routes.ts';
import inventoryRoutes from './routes/inventory.routes.ts';
import billingRoutes from './routes/billing.routes.ts';
import analyticsRoutes from './routes/analytics.routes.ts';
import timelineRoutes from './routes/timeline.routes.ts';
import { tenantMiddleware } from './middleware/tenant.middleware.ts';
import stripeRoutes from './routes/stripe.routes.ts';

const app = new Hono();

app.use('*', cors());
app.use('*', tenantMiddleware);

// Swagger Documentation
app.get('/swagger', swaggerUI({ url: '/doc' }));
app.get('/doc', (c) => {
    return c.json({
        openapi: '3.0.0',
        info: {
            title: 'Warehouse Management API',
            version: '1.0.0',
            description: 'Comprehensive API for managing warehouse operations, inventory, and orders.',
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                LoginCredentials: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'admin@example.com' },
                        password: { type: 'string', format: 'password', example: 'password123' },
                    },
                },
                RegisterCredentials: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'employee', 'user'], default: 'user' },
                    },
                },
                WarehouseCreate: {
                    type: 'object',
                    required: ['name', 'location', 'totalCapacity'],
                    properties: {
                        name: { type: 'string' },
                        location: { type: 'string' },
                        totalCapacity: { type: 'number' },
                    },
                },
                ZoneCreate: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string' },
                    },
                },
                ItemRegister: {
                    type: 'object',
                    required: ['customerId', 'name', 'declaredValue'],
                    properties: {
                        customerId: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        category: { type: 'string' },
                        declaredValue: { type: 'number' },
                    },
                },
                ItemStore: {
                    type: 'object',
                    required: ['itemId', 'slotId', 'staffId'],
                    properties: {
                        itemId: { type: 'string', format: 'uuid' },
                        slotId: { type: 'string', format: 'uuid' },
                        staffId: { type: 'string', format: 'uuid' },
                    },
                },
                OrderCreate: {
                    type: 'object',
                    required: ['customerId', 'orderType', 'itemIds'],
                    properties: {
                        customerId: { type: 'string', format: 'uuid' },
                        orderType: { type: 'string', enum: ['inbound', 'outbound'] },
                        staffId: { type: 'string', format: 'uuid' },
                        itemIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                    },
                },
            },
        },
        paths: {
            '/auth/login': {
                post: {
                    tags: ['Authentication'],
                    summary: 'User Login',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/LoginCredentials' } },
                        },
                    },
                    responses: { 200: { description: 'Successful login' } },
                },
            },
            '/auth/register': {
                post: {
                    tags: ['Authentication'],
                    summary: 'User Registration',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/RegisterCredentials' } },
                        },
                    },
                    responses: { 201: { description: 'User created' } },
                },
            },
            '/warehouses': {
                get: {
                    tags: ['Warehouses'],
                    summary: 'Get all warehouses',
                    responses: { 200: { description: 'List of warehouses' } },
                },
                post: {
                    tags: ['Warehouses'],
                    summary: 'Create a warehouse',
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/WarehouseCreate' } },
                        },
                    },
                    responses: { 201: { description: 'Warehouse created' } },
                },
            },
            '/inventory/register': {
                post: {
                    tags: ['Inventory'],
                    summary: 'Register a new item',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ItemRegister' } },
                        },
                    },
                    responses: { 201: { description: 'Item registered' } },
                },
            },
            '/inventory/store': {
                post: {
                    tags: ['Inventory'],
                    summary: 'Store an item in a slot',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ItemStore' } },
                        },
                    },
                    responses: { 201: { description: 'Item stored' } },
                },
            },
            '/orders': {
                post: {
                    tags: ['Orders'],
                    summary: 'Create a new order',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/OrderCreate' } },
                        },
                    },
                    responses: { 201: { description: 'Order created' } },
                },
            },
        },
    });
});

// Initialize Data Source
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

// Mount Routes
app.route('/auth', authRoutes);
app.route('/users', userRoutes);
app.route('/warehouses', warehouseRoutes);
app.route('/orders', orderRoutes);
app.route('/inventory', inventoryRoutes);
app.route('/billing', billingRoutes);
app.route('/analytics', analyticsRoutes);
app.route('/timeline', timelineRoutes);

app.get('/', (c) => {
    return c.json({
        message: 'Warehouse Management API is running',
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
