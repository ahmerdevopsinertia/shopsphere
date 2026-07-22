# Sprint 4 – Inventory Management

## Goal

Implement inventory management for products while maintaining clean architecture and business rule separation.

## Features Completed

- Inventory database model
- One-to-one Product ↔ Inventory relationship
- Create Inventory API
- Get Inventory API
- Update Inventory API (stock adjustment)
- Inventory integration into Product APIs
- Available stock calculation
- Product existence validation
- Duplicate inventory prevention
- Quantity adjustment using positive and negative changes
- Prevention of reducing quantity below reserved stock
- JWT & RBAC protection
- DTO validation
- Global ValidationPipe hardening

## APIs

### Inventory

- POST /inventory
- GET /inventory/:productId
- PATCH /inventory/:productId

### Products

- GET /products
- GET /products/:id

## Business Rules

- One inventory per product
- Inventory cannot exist without a product
- Available stock = Quantity − Reserved
- Reserved stock cannot be modified directly

## Architecture

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
```

## Architecture Decisions

- Inventory updates are performed using stock adjustments (`change`) rather than replacing the total quantity.
- Prisma's atomic `increment` operation is used to ensure safe quantity updates.
- Available stock is always calculated as:

```
available = quantity - reserved
```

## Status

Sprint 4 Completed ✅

