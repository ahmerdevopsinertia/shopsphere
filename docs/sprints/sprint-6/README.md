# Sprint 6 – Shopping Cart

## Objective

Implement a complete Shopping Cart module that allows authenticated customers to manage products before checkout.

The module supports adding products, updating quantities, removing items, replacing cart contents, calculating totals, and validating product and inventory availability.

---

## Features Implemented

* Cart database schema
* CartItem database schema
* Add Product To Cart API
* Get Current User Cart API
* Update Cart Item Quantity API
* Delete Cart Item API
* Replace Cart Items API
* Cart total calculation
* Product validation
* Inventory availability validation
* Shared cart validation logic
* Automatic cart creation
* JWT Authentication
* Repository Pattern implementation

---

## APIs

### Customer APIs

* POST /cart
* GET /cart
* PATCH /cart/items/:productId
* DELETE /cart/items/:productId
* PUT /cart/items

---

## Business Rules

* Cart is automatically created when a user adds the first product.
* Only authenticated users can access cart APIs.
* Product must exist before adding to cart.
* Product status must be ACTIVE.
* Inventory availability must be checked before adding or updating quantity.
* Available inventory is calculated as:


Available = Quantity - Reserved


* User cannot add quantity greater than available inventory.
* Duplicate products are not allowed in replace cart request.
* Updating an existing cart item increases or replaces quantity based on operation.
* Replace cart operation removes products that are not included in the request.

---

## Cart Operations

### Add To Cart

Flow:


Validate Product

↓

Find User Cart

↓

Create Cart If Missing

↓

Check Existing Cart Item

↓

Increase Quantity OR Create Item

↓

Return Updated Cart


---

### Update Quantity

Flow:


Find Cart

↓

Find Cart Item

↓

Validate Product

↓

Validate Inventory

↓

Update Quantity

↓

Return Updated Cart


---

### Replace Cart Items

Flow:


Receive Complete Cart Items

↓

Validate Products

↓

Delete Removed Items

↓

Update Existing Items

↓

Create New Items

↓

Return Updated Cart


---

## Architecture

Controller → Service → Repository → Prisma → PostgreSQL


Business validation is handled inside the Service layer.

Database operations and transactions are handled inside the Repository layer.

---

## Transaction Handling

Cart replacement operations use Prisma transactions.

The following operations are executed atomically:

* Delete removed cart items
* Update existing cart items
* Create new cart items

If any operation fails, all changes are rolled back.

---

## Security

All cart APIs require:

* JWT Authentication

Cart data is always filtered by authenticated user ID.

Users cannot access another user's cart.

---

## Design Decisions

* Repository Pattern
* DTO Validation
* JWT Authentication
* Service Layer Business Rules
* Prisma Transactions
* Inventory Validation Before Cart Modification
* Automatic Cart Creation
* Separation of Business Logic and Data Access

---

## Sprint Outcome

A production-ready Shopping Cart module has been implemented.

The module is ready for the next phase:

* Checkout processing
* Order conversion
* Payment workflow
* Inventory confirmation