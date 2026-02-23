const BASE_URL = "http://localhost:5500";

async function runTests() {
    console.log("--- Warehouse Management System Verification ---");

    // 1. Register Admin
    console.log("\n1. Registering Admin...");
    const adminRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "admin@warehouse.com",
            password: "adminpassword",
            firstName: "Super",
            lastName: "Admin",
            role: "ADMIN"
        }),
    });
    const adminData = await adminRes.json();
    console.log("Admin Register:", adminData);

    // 2. Login Admin
    console.log("\n2. Logging in Admin...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "admin@warehouse.com",
            password: "adminpassword"
        }),
    });
    const { token: adminToken } = await loginRes.json();

    // 3. Create Storage Unit (Admin)
    console.log("\n3. Creating Storage Unit (Admin)...");
    const unitRes = await fetch(`${BASE_URL}/storage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
            name: "Unit A-101",
            type: "Large",
            capacity: 50.0,
            pricePerDay: 10.50
        }),
    });
    const unitData = await unitRes.json();
    console.log("Storage Unit Created:", unitData);

    // 4. Register Regular User
    console.log("\n4. Registering User...");
    const userRegisterRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "client@example.com",
            password: "userpassword",
            firstName: "John",
            lastName: "Doe"
        }),
    });
    const userData = await userRegisterRes.json();

    // 5. Login User
    console.log("\n5. Logging in User...");
    const userLoginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "client@example.com",
            password: "userpassword"
        }),
    });
    const { token: userToken } = await userLoginRes.json();

    // 6. User Book Space
    console.log("\n6. User booking space...");
    const bookingRes = await fetch(`${BASE_URL}/auth/login`, { // Wait, using userToken now
    });

    const actualBookingRes = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
            storageUnitId: unitData.id,
            itemsDescription: "10 boxes of documents",
            startDate: new Date().toISOString()
        }),
    });
    const bookingData = await actualBookingRes.json();
    console.log("Booking Created:", bookingData);

    // 7. User adds items to booking
    console.log("\n7. User adding items to booking...");
    const itemRes1 = await fetch(`${BASE_URL}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
            bookingId: bookingData.id,
            name: "Office Chair",
            quantity: 2,
            weight: 15.5
        }),
    });
    console.log("Item 1 Added:", await itemRes1.json());

    const itemRes2 = await fetch(`${BASE_URL}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
            bookingId: bookingData.id,
            name: "Desktop PC",
            quantity: 1
        }),
    });
    console.log("Item 2 Added:", await itemRes2.json());

    // 8. List Booking Inventory
    console.log("\n8. Fetching booking inventory...");
    const inventoryRes = await fetch(`${BASE_URL}/items/booking/${bookingData.id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log("Inventory List:", await inventoryRes.json());

    // 9. Complete Booking (Staff/Admin) and Generate Invoice
    console.log("\n9. Completing booking (Generating Invoice)...");
    const completeRes = await fetch(`${BASE_URL}/bookings/${bookingData.id}/complete`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    const completeData = await completeRes.json();
    console.log("Completion Result:", completeData);

    console.log("\n--- Verification Complete ---");
}

runTests().catch(console.error);
