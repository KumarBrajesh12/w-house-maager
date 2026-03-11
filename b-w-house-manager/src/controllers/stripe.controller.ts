import type { Context } from 'hono';
import { StripeService } from '../services/StripeService.ts';

const stripeService = new StripeService();

export const createCheckoutSession = async (c: Context) => {
    try {
        const tenantId = c.get('tenantId');
        const { priceId, successUrl, cancelUrl } = await c.req.json();

        const session = await stripeService.createCheckoutSession(tenantId, priceId, successUrl, cancelUrl);
        return c.json({ url: session.url });
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};

export const handleWebhook = async (c: Context) => {
    try {
        const signature = c.req.header('stripe-signature') || '';
        const body = await c.req.text();

        await stripeService.handleWebhook(body, signature);
        return c.json({ received: true });
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};
