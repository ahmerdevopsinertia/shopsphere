# Orders Module

## Module Overview

The Orders module is responsible for creating customer orders, validating inventory, reserving stock, calculating totals, and managing the complete order lifecycle.

---

## Order Flow

Customer Login

↓

Browse Products

↓

Create Order

↓

Validate Products

↓

Validate Inventory

↓

Reserve Inventory

↓

Create Order Transaction

↓

Order Status Management

↓

Inventory Finalization

---

## Order Status Flow

PENDING

↓

CONFIRMED

↓

PAID

↓

SHIPPED

↓

DELIVERED

Alternative Flow

PENDING

↓

CANCELLED

---

## Inventory Rules

### Order Created

* Reserved += Ordered Quantity
* Quantity remains unchanged

### Order Paid

* Quantity -= Ordered Quantity
* Reserved -= Ordered Quantity

### Order Cancelled

* Reserved -= Ordered Quantity
* Quantity remains unchanged

---

## Transaction

The following operations are executed inside a single Prisma transaction:

* Create Order
* Create Order Items
* Reserve Inventory

Order status updates are also executed inside a transaction to ensure inventory consistency.

---

## Search & Pagination

Supported on:

GET /orders

Query Parameters

* page
* limit
* search

---

## Security

Customer APIs

* JWT Authentication

Admin APIs

* JWT Authentication
* Role-Based Access Control

---

## Error Handling

400 Bad Request

* Duplicate products
* Invalid order status transition
* Product inactive
* Insufficient inventory

401 Unauthorized

* Missing or invalid JWT

403 Forbidden

* Non-admin updating order status

404 Not Found

* Product not found
* Inventory not found
* Order not found

409 Conflict

* Business conflicts where applicable

---

## Design Decisions

* Repository Pattern
* Prisma Transactions
* DTO Validation
* JWT Authentication
* RBAC
* Separation of Business Logic and Data Access
* Inventory Reservation Strategy
