import { AppDataSource } from "../config/data-source";
import { Item } from "../entities/Item";
import { Booking, BookingStatus } from "../entities/Booking";
import type { Context } from "hono";

const itemRepository = AppDataSource.getRepository(Item);
const bookingRepository = AppDataSource.getRepository(Booking);

export const addItem = async (c: Context) => {
    try {
        const user = c.get("jwtPayload");
        const { bookingId, name, quantity, weight, dimensions } = await c.req.json();

        const booking = await bookingRepository.findOne({
            where: { id: bookingId, user: { id: user.id } }
        });

        if (!booking) {
            return c.json({ error: "Booking not found or not authorized" }, 404);
        }

        if (booking.status !== BookingStatus.ACTIVE) {
            return c.json({ error: "Cannot add items to an inactive booking" }, 400);
        }

        const item = itemRepository.create({
            name,
            quantity,
            weight,
            dimensions,
            booking: { id: bookingId }
        });

        await itemRepository.save(item);
        return c.json(item, 201);
    } catch (error) {
        console.error("Add Item Error:", error);
        return c.json({ error: "Failed to add item" }, 500);
    }
};

export const getItemsByBooking = async (c: Context) => {
    try {
        const user = c.get("jwtPayload");
        const bookingId = parseInt(c.req.param("bookingId"));

        const booking = await bookingRepository.findOne({
            where: { id: bookingId, user: { id: user.id } }
        });

        if (!booking) {
            return c.json({ error: "Booking not found or not authorized" }, 404);
        }

        const items = await itemRepository.find({
            where: { booking: { id: bookingId } }
        });

        return c.json(items);
    } catch (error) {
        return c.json({ error: "Failed to fetch items" }, 500);
    }
};

export const removeItem = async (c: Context) => {
    try {
        const user = c.get("jwtPayload");
        const id = parseInt(c.req.param("id"));

        const item = await itemRepository.findOne({
            where: { id },
            relations: ["booking", "booking.user"]
        });

        if (!item || item.booking.user.id !== user.id) {
            return c.json({ error: "Item not found or not authorized" }, 404);
        }

        if (item.booking.status !== BookingStatus.ACTIVE) {
            return c.json({ error: "Cannot remove items from an inactive booking" }, 400);
        }

        await itemRepository.remove(item);
        return c.json({ message: "Item removed successfully" });
    } catch (error) {
        return c.json({ error: "Failed to remove item" }, 500);
    }
};
