import { Hono } from "hono";
import { addItem, getItemsByBooking, removeItem } from "../controllers/item.controller";
import { jwt } from "hono/jwt";

const itemRoutes = new Hono();

const secret = process.env.JWT_SECRET || "supersecretkey123";
itemRoutes.use("/*", jwt({ secret, alg: "HS256" }));

itemRoutes.post("/", addItem);
itemRoutes.get("/booking/:bookingId", getItemsByBooking);
itemRoutes.delete("/:id", removeItem);

export default itemRoutes;
