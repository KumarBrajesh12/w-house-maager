import { Hono } from 'hono';
import * as analyticsController from '../controllers/analytics.controller.ts';

const analyticsRoutes = new Hono();

analyticsRoutes.get('/utilization', analyticsController.getWarehouseUtilization);
analyticsRoutes.get('/revenue', analyticsController.getRevenueReport);
analyticsRoutes.get('/growth', analyticsController.getCustomerGrowth);

export default analyticsRoutes;
