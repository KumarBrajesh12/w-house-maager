import { stripe } from '../config/stripe.ts';
import { AppDataSource } from '../config/data-source.ts';
import { Tenant } from '../entities/Tenant.ts';

export class StripeService {
    private tenantRepository = AppDataSource.getRepository(Tenant);

    async createOrGetCustomer(tenantId: string) {
        const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
        if (!tenant) throw new Error('Tenant not found');

        if (tenant.stripeCustomerId) {
            return tenant.stripeCustomerId;
        }

        const customer = await stripe.customers.create({
            name: tenant.name,
            metadata: { tenantId: tenant.id },
        });

        tenant.stripeCustomerId = customer.id;
        await this.tenantRepository.save(tenant);

        return customer.id;
    }

    async createCheckoutSession(tenantId: string, priceId: string, successUrl: string, cancelUrl: string) {
        const customerId = await this.createOrGetCustomer(tenantId);

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { tenantId },
        });

        return session;
    }

    async handleWebhook(body: string, signature: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
        let event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            throw new Error(`Webhook Error: ${err.message}`);
        }

        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                const subscription = event.data.object as any;
                await this.updateTenantSubscription(subscription);
                break;
            case 'customer.subscription.deleted':
                const deletedSub = event.data.object as any;
                await this.cancelTenantSubscription(deletedSub);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }

    private async updateTenantSubscription(subscription: any) {
        const customerId = subscription.customer as string;
        const tenant = await this.tenantRepository.findOneBy({ stripeCustomerId: customerId });
        if (tenant) {
            tenant.subscriptionStatus = subscription.status;
            tenant.planId = subscription.items.data[0].price.id;
            await this.tenantRepository.save(tenant);
        }
    }

    private async cancelTenantSubscription(subscription: any) {
        const customerId = subscription.customer as string;
        const tenant = await this.tenantRepository.findOneBy({ stripeCustomerId: customerId });
        if (tenant) {
            tenant.subscriptionStatus = 'canceled';
            await this.tenantRepository.save(tenant);
        }
    }
}
