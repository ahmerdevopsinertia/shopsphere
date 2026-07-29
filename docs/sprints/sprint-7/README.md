# Sprint 7 – Checkout & Order Conversion

## Objective

Implement a complete checkout flow that converts a customer's cart into an order using a single database transaction while preparing the system for future payment gateway integration.

## Features Implemented

* Checkout module
* Checkout API
* Cart validation
* Product validation
* Inventory validation
* Order creation
* Order item creation
* Inventory reservation
* Cart clearing after successful checkout
* Single Prisma transaction
* Payment status support
* Payment reference generation
* Serializable transaction isolation
* JWT Authentication

## APIs

### Customer APIs

* POST /checkout

## Business Rules

* User must be authenticated.
* Cart must exist.
* Cart must not be empty.
* Every product must exist.
* Every product must be ACTIVE.
* Inventory must exist.
* Inventory must be sufficient.
* Order is created with PENDING status.
* Payment status is initialized as PENDING.
* Payment reference is generated automatically.
* Inventory is reserved during checkout.
* Cart is cleared only after successful checkout.
* If any operation fails, the complete transaction is rolled back.

## Transaction Flow

Load Cart

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

Return Order Response

## Architecture

Controller → Service → Repository → Prisma → PostgreSQL

Business validation is handled inside the Service layer.

Database writes are executed inside a single Prisma transaction.

## Payment Preparation

The checkout process prepares the application for future payment gateway integration.

Current implementation includes:

* Payment Status
* Payment Reference
* Transaction-ready checkout flow

Future integrations may include:

* Stripe
* PayPal
* Apple Pay
* Google Pay
* Tabby
* Tamara

## Sprint Outcome

A production-ready Checkout module capable of converting carts into orders safely using transactional processing while being fully prepared for payment gateway integration.