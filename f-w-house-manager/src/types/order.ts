import { Item } from './inventory';
import { User } from './auth';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type OrderType = 'inbound' | 'outbound';

export interface OrderItem {
    id: string;
    quantity: number;
    priceAtOrder: number;
    item: Item;
}

export interface Order {
    id: string;
    orderNumber: string;
    type: OrderType;
    status: OrderStatus;
    totalAmount: number;
    customer?: User;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderDTO {
    type: OrderType;
    customerId?: string;
    items: {
        itemId: string;
        quantity: number;
    }[];
}
