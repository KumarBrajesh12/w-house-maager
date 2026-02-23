import type { Context } from 'hono';
import { BillingService } from '../services/BillingService.ts';

const billingService = new BillingService();

export const generateInvoice = async (c: Context) => {
    try {
        const { customerId, startDate, endDate } = await c.req.json();
        const invoice = await billingService.generateInvoice(
            customerId,
            new Date(startDate),
            new Date(endDate)
        );
        if (!invoice) return c.json({ message: 'No billable usage found for this period' }, 200);
        return c.json(invoice, 201);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};

export const getCustomerInvoices = async (c: Context) => {
    try {
        const customerId = c.req.param('customerId');
        const invoices = await billingService.getCustomerInvoices(customerId);
        return c.json(invoices);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
};
