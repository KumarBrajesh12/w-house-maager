import { AppDataSource } from "../config/data-source";
import { StorageUnit } from "../entities/StorageUnit";
import type { Context } from "hono";

const storageRepository = AppDataSource.getRepository(StorageUnit);

export const createUnit = async (c: Context) => {
    try {
        const body = await c.req.json();
        const unit = storageRepository.create(body);
        await storageRepository.save(unit);
        return c.json(unit, 201);
    } catch (error) {
        return c.json({ error: "Failed to create storage unit" }, 500);
    }
};

export const getUnits = async (c: Context) => {
    try {
        const units = await storageRepository.find();
        return c.json(units);
    } catch (error) {
        return c.json({ error: "Failed to fetch storage units" }, 500);
    }
};

export const updateUnit = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        const body = await c.req.json();
        await storageRepository.update(id, body);
        const updatedUnit = await storageRepository.findOneBy({ id });
        return c.json(updatedUnit);
    } catch (error) {
        return c.json({ error: "Failed to update storage unit" }, 500);
    }
};

export const deleteUnit = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        await storageRepository.delete(id);
        return c.json({ message: "Storage unit deleted" });
    } catch (error) {
        return c.json({ error: "Failed to delete storage unit" }, 500);
    }
};
