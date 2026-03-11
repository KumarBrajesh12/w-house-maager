import type { Context, Next } from 'hono';

export const tenantMiddleware = async (c: Context, next: Next) => {
    // In a real SAAS, we'd extract tenant from host (subdomain) or JWT
    // For now, we'll use the tenantId from the JWT payload
    const payload = c.get('jwtPayload');

    if (payload && payload.tenantId) {
        c.set('tenantId', payload.tenantId);
    } else {
        const path = c.req.path;
        const isPublicRoute = path === '/auth/login' ||
            path === '/auth/register' ||
            path.startsWith('/swagger') ||
            path.startsWith('/doc') ||
            path === '/' ||
            path === '/health';

        if (!isPublicRoute) {
            return c.json({ error: 'Unauthorized: Missing tenant context' }, 401);
        }
    }

    await next();
};
