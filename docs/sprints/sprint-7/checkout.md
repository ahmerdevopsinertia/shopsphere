# Checkout Module

## Module Overview

The Checkout module is responsible for converting a customer's shopping cart into an order while validating products, inventory, reserving stock, clearing the cart, and preparing payment information.

---

## Checkout Flow

Customer Login

↓

View Cart

↓

Checkout

↓

Validate Cart

↓

Validate Products

↓

Validate Inventory

↓

Create Order

↓

Create Order Items

↓

Reserve Inventory

↓

Clear Cart

↓

Generate Payment Reference

↓

Return Order

---

## Transaction

The following operations execute inside a single Prisma transaction:

* Create Order
* Create Order Items
* Reserve Inventory
* Clear Cart

If any operation fails, the entire transaction is rolled back.

---

## Payment Preparation

Every checkout initializes payment information.

### Payment Status

* PENDING
* PAID
* FAILED
* REFUNDED

### Payment Reference

Automatically generated for every order.

Example

PAY-7c9c8184-0a2c-4f44-b418-f4d7c7e41d22

This reference will later be used to integrate external payment gateways.

---

## Inventory Rules

### Checkout

* Reserved += Ordered Quantity
* Quantity remains unchanged

Inventory quantity is deducted only after payment is completed through the Order module.

---

## Security

Customer APIs

* JWT Authentication

---

## Error Handling

400 Bad Request

* Cart is empty
* Product inactive
* Insufficient inventory

401 Unauthorized

* Missing or invalid JWT

404 Not Found

* Cart not found
* Product not found
* Inventory not found

---

## Design Decisions

* Repository Pattern
* Service Layer Validation
* Prisma Transactions
* Serializable Transaction Isolation
* Payment Preparation
* Inventory Reservation Strategy
* Separation of Checkout and Order Responsibilities