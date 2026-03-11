import { Hono } from "hono";
import { createUnit, getUnits, updateUnit, deleteUnit } from "../controllers/storage.controller";
import { jwt } from "hono/jwt";
import { checkRole } from "../middleware/role.middleware";
import { UserRole } from "../entities/User";

const storageRoutes = new Hono();

const secret = process.env.JWT_SECRET || "supersecretkey123";
storageRoutes.use("/*", jwt({ secret, alg: "HS256" }));

// Only Admin and Staff can manage units
storageRoutes.get("/", getUnits);
storageRoutes.post("/", checkRole([UserRole.ADMIN, UserRole.STAFF]), createUnit);
storageRoutes.patch("/:id", checkRole([UserRole.ADMIN, UserRole.STAFF]), updateUnit);
storageRoutes.delete("/:id", checkRole([UserRole.ADMIN]), deleteUnit);

export default storageRoutes;
