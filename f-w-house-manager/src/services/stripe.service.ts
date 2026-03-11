import api from '@/lib/axios';

export const stripeService = {
    async createCheckoutSession(priceId: string) {
        const successUrl = `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${window.location.origin}/pricing`;

        const response = await api.post('/stripe/checkout', {
            priceId,
            successUrl,
            cancelUrl
        }) as any;

        if (response.url) {
            window.location.href = response.url;
        }
    }
};
