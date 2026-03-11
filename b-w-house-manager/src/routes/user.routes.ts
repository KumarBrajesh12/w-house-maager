import { Hono } from "hono";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { jwt } from "hono/jwt";

const userRoutes = new Hono();

// Auth middlewware for all user routes
const secret = process.env.JWT_SECRET || "supersecretkey123";
userRoutes.use("/*", jwt({ secret, alg: "HS256" }));

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.patch("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
