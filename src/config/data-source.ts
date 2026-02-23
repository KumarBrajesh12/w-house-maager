import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { StorageUnit } from "../entities/StorageUnit";
import { Booking } from "../entities/Booking";
import { Invoice } from "../entities/Invoice";
import { Item } from "../entities/Item";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    synchronize: true, // Auto-create table in development
    logging: true,
    entities: [User, StorageUnit, Booking, Invoice, Item],
    subscribers: [],
    migrations: [],
});
