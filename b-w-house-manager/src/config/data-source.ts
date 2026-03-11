import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User.ts";
import { CustomerProfile } from "../entities/CustomerProfile.ts";
import { StaffProfile } from "../entities/StaffProfile.ts";
import { Warehouse } from "../entities/Warehouse.ts";
import { Zone } from "../entities/Zone.ts";
import { Rack } from "../entities/Rack.ts";
import { Slot } from "../entities/Slot.ts";
import { Item } from "../entities/Item.ts";
import { ItemStorage } from "../entities/ItemStorage.ts";
import { Order } from "../entities/Order.ts";
import { OrderItem } from "../entities/OrderItem.ts";
import { InventoryMovement } from "../entities/InventoryMovement.ts";
import { PricingPlan } from "../entities/PricingPlan.ts";
import { CustomerRental } from "../entities/CustomerRental.ts";
import { Invoice } from "../entities/Invoice.ts";
import { InvoiceItem } from "../entities/InvoiceItem.ts";
import { ActivityLog } from "../entities/ActivityLog.ts";
import { Tenant } from "../entities/Tenant.ts";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const AppDataSource = new DataSource({
    type: "postgres",
    url: dbUrl,
    synchronize: true, // Auto-create table in development
    logging: true,
    entities: [
        Tenant,
        User,
        CustomerProfile,
        StaffProfile,
        Warehouse,
        Zone,
        Rack,
        Slot,
        Item,
        ItemStorage,
        Order,
        OrderItem,
        InventoryMovement,
        PricingPlan,
        CustomerRental,
        Invoice,
        InvoiceItem,
        ActivityLog
    ],
    subscribers: [],
    migrations: [],
});
