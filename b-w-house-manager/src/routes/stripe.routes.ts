import { Hono } from 'hono';
import { createCheckoutSession, handleWebhook } from '../controllers/stripe.controller.ts';
import { jwt } from 'hono/jwt';

const stripeRoutes = new Hono();

// Public webhook endpoint
stripeRoutes.post('/webhook', handleWebhook);

// Protected routes
const secret = process.env.JWT_SECRET || 'supersecretkey123';
stripeRoutes.use('/checkout', jwt({ secret, alg: 'HS256' }));
stripeRoutes.post('/checkout', createCheckoutSession);

export default stripeRoutes;
