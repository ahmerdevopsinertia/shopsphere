# Cart Module

## Module Overview

The Cart module manages customer shopping carts before checkout.

It allows authenticated users to add products, update quantities, remove items, and synchronize complete cart contents.

The module is responsible for:

* Managing user carts
* Managing cart items
* Validating products
* Validating inventory availability
* Calculating cart totals
* Preparing cart data for checkout process

---

## Cart Flow

Customer Login

↓

Browse Products

↓

Add Product To Cart

↓

Validate Product

↓

Validate Inventory

↓

Create / Update Cart Item

↓

Calculate Cart Total

↓

Proceed To Checkout

---

## Cart Data Model

### Cart

Represents a user's shopping cart.

Relationship:


User

↓

Cart

↓

CartItem

↓

Product


---

### CartItem

Stores products selected by the customer.

Fields:

* id
* cartId
* productId
* quantity

---

## Cart Operations


## Add To Cart

Endpoint


POST /cart


Process:


Receive Product

↓

Validate Product

↓

Validate Inventory

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

## Get Cart

Endpoint


GET /cart


Purpose:

Returns the currently authenticated user's cart.

Response includes:

* Cart ID
* Items
* Product information
* Quantity
* Unit price
* Subtotal
* Total amount

---

## Update Cart Quantity

Endpoint


PATCH /cart/items/:productId


Purpose:

Updates quantity of an existing cart item.

Validation:

* Cart exists
* Cart item exists
* Product exists
* Product status is ACTIVE
* Inventory is available

Example:

Before:


iPhone Case x2


Request:

```json
{
    "quantity":5
}

After:

iPhone Case x5
Delete Cart Item

Endpoint

DELETE /cart/items/:productId

Purpose:

Removes a product from the user's cart.

Flow:

Find User Cart

↓

Find Cart Item

↓

Delete Item

↓

Return Updated Cart
Replace Cart Items

Endpoint

PUT /cart/items

Purpose:

Synchronizes complete cart contents.

The request represents the final desired cart state.

Example:

Current Cart:

Product A x2
Product B x1
Product C x4

Request:

{
    "items": [
        {
            "productId":"B",
            "quantity":5
        },
        {
            "productId":"D",
            "quantity":2
        }
    ]
}

Final Cart:

Product B x5
Product D x2

Products not included in the request are removed.

Validation Rules
Product Validation

Before modifying cart items:

Product must exist
Product status must be ACTIVE
Inventory Validation

Available inventory calculation:

Available Stock = Quantity - Reserved

Example:

Quantity = 100

Reserved = 20

Available = 80

Requested cart quantity cannot exceed available stock.

Duplicate Product Handling

Replace cart operation prevents duplicate products.

Invalid request:

{
    "items": [
        {
            "productId":"A",
            "quantity":2
        },
        {
            "productId":"A",
            "quantity":3
        }
    ]
}

Expected:

400 Bad Request
Shared Validation Logic

Reusable service helper:

validateProductForCart()

Responsibilities:

Product existence validation
Product status validation
Inventory validation

Used by:

Add Cart Item
Update Quantity
Replace Cart Items
Cart Creation Helper

Reusable helper:

getOrCreateCart()

Responsibilities:

Find existing user cart
Create cart if missing
Return valid cart instance

Benefits:

Removes duplicate logic
Improves maintainability
Keeps service methods clean
Transaction Handling

Replace cart operation uses Prisma transaction.

Executed operations:

Delete removed cart items
Update existing items
Create new items

Transaction guarantees:

Data consistency
Atomic updates
Automatic rollback on failure
Security

Cart APIs are protected using:

JwtAuthGuard

Users can only access their own cart.

All queries are filtered using authenticated user ID.

Error Handling
400 Bad Request
Duplicate products in replace request
Product inactive
Insufficient inventory
401 Unauthorized
Missing JWT
Invalid JWT
404 Not Found
Product not found
Cart not found
Cart item not found
Design Decisions
Repository Pattern
DTO Validation
JWT Authentication
Service Layer Business Rules
Prisma Transaction Support
Inventory Validation Before Cart Updates
Automatic Cart Creation
Separation of Business Logic and Database Access
Future Integration

The Cart module prepares the system for:

Cart

↓

Checkout

↓

Order Creation

↓

Inventory Finalization

↓

Payment Processing