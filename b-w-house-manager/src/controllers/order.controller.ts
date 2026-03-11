import type { Context } from 'hono';
import { OrderService } from '../services/OrderService.ts';
import { OrderType, OrderStatus } from '../entities/Order.ts';

const orderService = new OrderService();

export const createOrder = async (c: Context) => {
    try {
        const { customerId, orderType, staffId, itemIds } = await c.req.json();
        const order = await orderService.createOrder(customerId, orderType as OrderType, staffId, itemIds);
        return c.json(order, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const updateOrderStatus = async (c: Context) => {
    try {
        const orderId = c.req.param('orderId');
        const { status } = await c.req.json();
        const order = await orderService.updateOrderStatus(orderId, status as OrderStatus);
        return c.json(order);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const getOrderDetails = async (c: Context) => {
    try {
        const orderId = c.req.param('orderId');
        const order = await orderService.getOrderDetails(orderId);
        if (!order) return c.json({ error: 'Order not found' }, 404);
        return c.json(order);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};
