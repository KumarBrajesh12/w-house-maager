import { Hono } from "hono";
import { createBooking, completeBooking, getMyBookings } from "../controllers/booking.controller";
import { jwt } from "hono/jwt";

const bookingRoutes = new Hono();

const secret = process.env.JWT_SECRET || "supersecretkey123";
bookingRoutes.use("/*", jwt({ secret, alg: "HS256" }));

bookingRoutes.post("/", createBooking);
bookingRoutes.post("/:id/complete", completeBooking);
bookingRoutes.get("/me", getMyBookings);

export default bookingRoutes;
