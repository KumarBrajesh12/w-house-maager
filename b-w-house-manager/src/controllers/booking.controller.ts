import { AppDataSource } from "../config/data-source";
import { Booking, BookingStatus } from "../entities/Booking";
import { StorageUnit } from "../entities/StorageUnit";
import { Invoice } from "../entities/Invoice";
import type { Context } from "hono";

const bookingRepository = AppDataSource.getRepository(Booking);
const storageRepository = AppDataSource.getRepository(StorageUnit);
const invoiceRepository = AppDataSource.getRepository(Invoice);

export const createBooking = async (c: Context) => {
    try {
        const user = c.get("jwtPayload");
        const { storageUnitId, itemsDescription, startDate, endDate } = await c.req.json();

        const unit = await storageRepository.findOneBy({ id: storageUnitId });
        if (!unit || !unit.isAvailable) {
            return c.json({ error: "Storage unit not available" }, 400);
        }

        const booking = bookingRepository.create({
            itemsDescription,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            user: { id: user.id },
            storageUnit: { id: storageUnitId },
        });

        await bookingRepository.save(booking);

        // Mark unit as unavailable
        unit.isAvailable = false;
        await storageRepository.save(unit);

        return c.json(booking, 201);
    } catch (error) {
        return c.json({ error: "Booking failed" }, 500);
    }
};

export const completeBooking = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        const booking = await bookingRepository.findOne({
            where: { id },
            relations: ["storageUnit"]
        });

        if (!booking || booking.status !== BookingStatus.ACTIVE) {
            return c.json({ error: "Active booking not found" }, 404);
        }

        booking.endDate = new Date();
        booking.status = BookingStatus.COMPLETED;
        await bookingRepository.save(booking);

        // Calculate billing
        const days = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
        const amount = days * booking.storageUnit.pricePerDay;

        const invoice = invoiceRepository.create({
            amount,
            booking: { id: booking.id }
        });
        await invoiceRepository.save(invoice);

        // Mark unit as available
        booking.storageUnit.isAvailable = true;
        await storageRepository.save(booking.storageUnit);

        return c.json({ message: "Booking completed and invoice generated", amount, invoice });
    } catch (error) {
        return c.json({ error: "Failed to complete booking" }, 500);
    }
};

export const getMyBookings = async (c: Context) => {
    try {
        const user = c.get("jwtPayload");
        const bookings = await bookingRepository.find({
            where: { user: { id: user.id } },
            relations: ["storageUnit", "invoices"]
        });
        return c.json(bookings);
    } catch (error) {
        return c.json({ error: "Failed to fetch bookings" }, 500);
    }
};
