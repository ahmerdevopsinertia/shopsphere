# Sprint 5 – Orders

## Objective

Implement a complete Order Management module that allows authenticated customers to place orders while validating products, inventory availability, and maintaining data consistency using database transactions.

## Features Implemented

* Order database schema
* OrderItem database schema
* Order Status enum
* Create Order API
* Get Order by ID API
* Get User Orders API
* Pagination
* Search by Order ID / Status
* Inventory reservation
* Prisma transaction support
* Order status management
* Inventory synchronization during status changes
* JWT Authentication
* Role-Based Access Control (RBAC)

## APIs

### Customer APIs

* POST /orders
* GET /orders
* GET /orders/:id

### Admin APIs

* PATCH /orders/:id/status

## Business Rules

* User cannot order duplicate products in a single order.
* Product must exist.
* Product must be ACTIVE.
* Inventory must exist.
* Available inventory must be sufficient.
* Inventory is reserved when an order is created.
* Inventory quantity is deducted only when the order is marked as PAID.
* Reserved inventory is released when an order is CANCELLED.
* Only valid order status transitions are allowed.
* Only ADMIN users can update order status.

## Architecture

Controller → Service → Repository → Prisma → PostgreSQL

Business validation is performed inside the Service layer.

Database operations and transactions are handled inside the Repository layer.

## Sprint Outcome

A production-ready Order module supporting transactional order processing with inventory reservation and lifecycle management.
