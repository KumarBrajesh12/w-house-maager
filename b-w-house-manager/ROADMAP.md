# 🛠️ Backend Implementation Roadmap (SAAS)

Track backend-specific progress here. Tick off items as they are completed.

---

## 🏗️ Phase 1: Multi-tenancy & Authentication
- [ ] **Data Model & Entities**
    - [ ] Update `Tenant` with `branding_config` and `settings`.
    - [ ] Add `created_by` and `tenant_id` to all core entities.
    - [ ] Implement database migrations for new schema changes.
- [ ] **Multi-tenant Logic**
    - [ ] Create `TenantMiddleware` for header/subdomain extraction.
    - [ ] Implement `TenantContext` for global access to current tenant ID.
    - [ ] Configure TypeORM global filtering for automatic row-level security.
- [ ] **Identity & Access**
    - [ ] JWT-based auth with tenant-scoped validation.
    - [ ] RBAC (Role Based Access Control) implementation for Admin/Staff/User.

## 📦 Phase 2: Core WMS Logic & APIs
- [ ] **Warehouse Infrastructure APIs**
    - [ ] CRUD for Warehouses, Zones, Racks, and Slots.
    - [ ] Logical validation for slot occupancy during item placement.
- [ ] **Inventory & Orders**
    - [ ] Inventory movement logging system.
    - [ ] Order lifecycle state machine (Draft -> Pending -> Stored -> Dispatched).
    - [ ] Barcode/QR code generation endpoint (generating data strings).

## 💳 Phase 3: Payments & Billing Service
- [ ] **Stripe Integration**
    - [ ] Stripe Product/Price synchronization script.
    - [ ] Subscription lifecycle service (Create, Cancel, Upgrade).
    - [ ] Webhook handler for `invoice.paid`, `customer.subscription.deleted`.
- [ ] **UPI (Razorpay/Cashfree)**
    - [ ] Create Order/Payment intent for one-time rentals.
    - [ ] Payment verification and ledger update logic.

## ☁️ Phase 4: Cloud & Document Services
- [ ] **AWS S3 Integration**
    - [ ] S3 Service for pre-signed URL generation.
    - [ ] Image resizing and optimization worker (optional/recommended).
- [ ] **PDF & Email Engine**
    - [ ] Invoice generation using `handlebars` or similar template engine.
    - [ ] Email service integration (AWS SES / SendGrid).

## 🚢 Phase 5: Infrastructure & DevOps
- [ ] **Dockerization**
    - [ ] Production-optimized Dockerfile for Bun/Hono.
    - [ ] Health check endpoints implementation.
- [ ] **Kubernetes**
    - [ ] K8s Deployment and Service YAMLs.
    - [ ] ConfigMaps and Secrets management for Environment Variables.
    - [ ] Horizontal Pod Autoscaler (HPA) definition.
