import { AppDataSource } from './config/data-source.ts';

async function setupMaterializedViews() {
    try {
        await AppDataSource.initialize();
        console.log("Setting up materialized views...");

        // 1. Warehouse Utilization View
        await AppDataSource.query(`
            DROP MATERIALIZED VIEW IF EXISTS warehouse_utilization_stats;
            CREATE MATERIALIZED VIEW warehouse_utilization_stats AS
            SELECT 
                w.id as warehouse_id,
                w.name as warehouse_name,
                COUNT(s.id) as total_slots,
                COUNT(CASE WHEN s.status = 'occupied' THEN 1 END) as occupied_slots,
                CASE 
                    WHEN COUNT(s.id) > 0 THEN (COUNT(CASE WHEN s.status = 'occupied' THEN 1 END)::numeric / COUNT(s.id)::numeric) * 100 
                    ELSE 0 
                END as utilization_percentage
            FROM warehouses w
            LEFT JOIN zones z ON z.warehouse_id = w.id
            LEFT JOIN racks r ON r.zone_id = z.id
            LEFT JOIN slots s ON s.rack_id = r.id
            GROUP BY w.id, w.name;
        `);

        // 2. Revenue Summary View
        await AppDataSource.query(`
            DROP MATERIALIZED VIEW IF EXISTS revenue_summary_stats;
            CREATE MATERIALIZED VIEW revenue_summary_stats AS
            SELECT 
                DATE_TRUNC('month', created_at) as billing_month,
                SUM(total_amount) as total_revenue,
                status
            FROM invoices
            GROUP BY billing_month, status;
        `);

        console.log("Materialized views created successfully.");
        await AppDataSource.destroy();
    } catch (error) {
        console.error("Error setting up materialized views:", error);
    }
}

setupMaterializedViews();
