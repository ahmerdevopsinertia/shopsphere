# Inventory Module

## Purpose

Manage stock levels independently from product information.

## Data Model

Inventory

- id
- productId
- quantity
- reserved
- available (calculated)

## API Endpoints

### Create Inventory

POST /inventory

Creates inventory for a product.

Business Rules

- Product must exist
- Inventory must not already exist

---

### Get Inventory

GET /inventory/:productId

Returns inventory details.

---

### Update Inventory

PATCH /inventory/:productId

Adjusts the inventory quantity using a positive or negative value.

Example Request

```json
{
  "change": 50
}
```

or

```json
{
  "change": -10
}
```

Business Rules

- Inventory must exist
- Quantity is adjusted atomically using Prisma's `increment`
- Quantity cannot become less than reserved stock
- Reserved quantity remains unchanged
- Available stock is calculated dynamically

Formula

available = quantity - reserved

## Available Stock

available = quantity - reserved

Reserved stock is managed internally by the Order module and cannot be updated manually.

## Inventory Adjustment

Inventory updates are performed using stock adjustments instead of replacing the total quantity.

Examples

Receive new stock

```json
{
  "change": 100
}
```

Remove damaged stock

```json
{
  "change": -5
}
```

This design aligns with real-world warehouse operations and prepares the system for future order processing and inventory movements.