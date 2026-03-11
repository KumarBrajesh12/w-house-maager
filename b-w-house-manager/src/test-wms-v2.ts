const BASE_URL = "http://localhost:5500";

async function runTests() {
    console.log("--- WMS v2 E2E Verification ---");

    // 1. Register Admin
    console.log("\n1. Registering Admin...");
    const adminRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "admin@warehouse.com",
            password: "adminpassword",
            role: "admin"
        }),
    });
    const adminRegData = await adminRes.json();
    console.log("Admin registered:", adminRegData.email);

    // Login to get token
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@warehouse.com", password: "adminpassword" }),
    });
    const adminLogin = await adminLoginRes.json();
    const adminToken = adminLogin.token;

    // 2. Create Warehouse
    console.log("\n2. Creating Warehouse...");
    const whRes = await fetch(`${BASE_URL}/warehouses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({ name: "Central WH", location: "Mumbai", totalCapacity: 1000 }),
    });
    const warehouse = await whRes.json();
    console.log("Warehouse:", warehouse.id);

    // 3. Add Zone
    console.log("\n3. Adding Zone...");
    const zoneRes = await fetch(`${BASE_URL}/warehouses/${warehouse.id}/zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({ name: "Zone A" }),
    });
    const zone = await zoneRes.json();

    // 4. Add Rack
    console.log("\n4. Adding Rack...");
    const rackRes = await fetch(`${BASE_URL}/warehouses/zones/${zone.id}/racks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({ code: "R1" }),
    });
    const rack = await rackRes.json();

    // 5. Add Slot
    console.log("\n5. Adding Slot...");
    const slotRes = await fetch(`${BASE_URL}/warehouses/racks/${rack.id}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({ sizeType: "large", volume: 100 }),
    });
    const slot = await slotRes.json();
    console.log("Slot created:", slot.id);

    // 6. Register Customer
    console.log("\n6. Registering Customer...");
    const custRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "customer@test.com", password: "custpassword", role: "customer" }),
    });
    const customerRegData = await custRes.json();
    console.log("Customer registered:", customerRegData.email);

    // Login for customer token
    const custLoginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "customer@test.com", password: "custpassword" }),
    });
    const customerLogin = await custLoginRes.json();
    const customerToken = customerLogin.token;
    const customerId = customerLogin.user.id;

    // 7. Register Item
    console.log("\n7. Registering Item...");
    const itemRes = await fetch(`${BASE_URL}/inventory/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${customerToken}` },
        body: JSON.stringify({
            customerId: customerId,
            name: "Cargo Box",
            category: "General",
            declaredValue: 500
        }),
    });
    const item = await itemRes.json();
    console.log("Item registered:", item.id);

    // 8. Create Store Order
    console.log("\n8. Creating Store Order...");
    const orderRes = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${customerToken}` },
        body: JSON.stringify({
            customerId: customerId,
            orderType: "store",
            itemIds: [item.id],
            staffId: adminLogin.user.id // Assigning admin as creator for verification
        }),
    });
    const order = await orderRes.json();
    console.log("Order created:", order.id);

    // 9. Staff Process Order (Store in Slot)
    console.log("\n9. Processing Order...");
    const processRes = await fetch(`${BASE_URL}/inventory/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({
            itemId: item.id,
            slotId: slot.id,
            staffId: adminLogin.user.id
        }),
    });
    console.log("Storage Result:", await processRes.json());

    // 10. Generate Invoice
    console.log("\n10. Generating Invoice...");
    const invoiceRes = await fetch(`${BASE_URL}/billing/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({ customerId: customerId }),
    });
    console.log("Invoice Result:", await invoiceRes.json());

    // 11. Get Analytics
    console.log("\n11. Fetching Analytics...");
    const analyticsRes = await fetch(`${BASE_URL}/analytics/utilization`, {
        headers: { "Authorization": `Bearer ${adminToken}` },
    });
    console.log("Utilization Analytics:", await analyticsRes.json());

    // 12. Get Timeline
    console.log("\n12. Fetching Item Timeline...");
    const timelineRes = await fetch(`${BASE_URL}/timeline/Item/${item.id}`, {
        headers: { "Authorization": `Bearer ${adminToken}` },
    });
    console.log("Item Timeline Logs:", await timelineRes.json());

    console.log("\n--- E2E Verification Complete ---");
}

runTests().catch(async (e) => {
    console.error("Test failed:", e);
});
