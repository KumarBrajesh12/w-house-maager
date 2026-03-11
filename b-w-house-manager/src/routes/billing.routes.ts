import { Hono } from 'hono';
import * as billingController from '../controllers/billing.controller.ts';

const billingRoutes = new Hono();

billingRoutes.post('/generate', billingController.generateInvoice);
billingRoutes.get('/customer/:customerId', billingController.getCustomerInvoices);

export default billingRoutes;
