import { Hono } from 'hono';
import * as orderController from '../controllers/order.controller.ts';

const orderRoutes = new Hono();

orderRoutes.post('/', orderController.createOrder);
orderRoutes.get('/:orderId', orderController.getOrderDetails);
orderRoutes.patch('/:orderId/status', orderController.updateOrderStatus);

export default orderRoutes;
