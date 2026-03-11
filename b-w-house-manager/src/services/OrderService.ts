import { AppDataSource } from '../config/data-source.ts';
import { Order, OrderType, OrderStatus } from '../entities/Order.ts';
import { OrderItem } from '../entities/OrderItem.ts';
import { ActivityLogService } from './ActivityLogService.ts';

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private orderItemRepository = AppDataSource.getRepository(OrderItem);
    private activityLogService = new ActivityLogService();

    async createOrder(customerId: string, orderType: OrderType, staffId: string, itemIds: string[]) {
        return await AppDataSource.transaction(async transactionalEntityManager => {
            const order = this.orderRepository.create({
                customerId,
                orderType,
                createdByStaffId: staffId,
                status: OrderStatus.PENDING
            });
            const savedOrder = await transactionalEntityManager.save(Order, order);

            const orderItems = itemIds.map(itemId => {
                return this.orderItemRepository.create({
                    orderId: savedOrder.id,
                    itemId
                });
            });
            await transactionalEntityManager.save(OrderItem, orderItems);

            await this.activityLogService.log(
                staffId || customerId,
                'Order',
                savedOrder.id,
                'CREATE',
                { orderType, itemIds }
            );

            return savedOrder;
        });
    }

    async updateOrderStatus(orderId: string, status: OrderStatus, staffId?: string) {
        await this.orderRepository.update(orderId, { status });
        const updatedOrder = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['items'] });

        if (updatedOrder && staffId) {
            await this.activityLogService.log(
                staffId,
                'Order',
                orderId,
                'UPDATE_STATUS',
                { status }
            );
        }

        return updatedOrder;
    }

    async getOrderDetails(orderId: string) {
        return await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['customer', 'items', 'items.item', 'items.assignedSlot']
        });
    }
}
