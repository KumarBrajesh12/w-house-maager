import api from '@/lib/axios';
import { Order, CreateOrderDTO, OrderStatus } from '@/types/order';

export const orderService = {
    async getOrders(): Promise<Order[]> {
        return api.get('/orders') as any;
    },

    async getOrderById(id: string): Promise<Order> {
        return api.get(`/orders/${id}`) as any;
    },

    async createOrder(data: CreateOrderDTO): Promise<Order> {
        return api.post('/orders', data) as any;
    },

    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        return api.patch(`/orders/${id}/status`, { status }) as any;
    },
};
