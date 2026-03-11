import type { Context, Next } from "hono";
import { UserRole } from "../entities/User";

export const checkRole = (roles: UserRole[]) => {
    return async (c: Context, next: Next) => {
        const payload = c.get("jwtPayload");

        if (!payload || !roles.includes(payload.role)) {
            return c.json({ error: "Forbidden: You do not have permission to access this resource" }, 403);
        }

        await next();
    };
};
