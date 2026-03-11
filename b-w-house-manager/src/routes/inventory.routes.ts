import { Hono } from 'hono';
import * as inventoryController from '../controllers/inventory.controller.ts';

const inventoryRoutes = new Hono();

inventoryRoutes.post('/register', inventoryController.registerItem);
inventoryRoutes.post('/store', inventoryController.storeItem);
inventoryRoutes.get('/customer/:customerId', inventoryController.getCustomerInventory);

export default inventoryRoutes;
