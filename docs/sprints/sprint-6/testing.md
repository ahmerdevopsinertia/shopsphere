# Sprint 6 Testing

## Cart Creation

### Successful Add To Cart

Scenario:

* Authenticated user
* Existing active product
* Available inventory

Expected Result:

* HTTP 201 Created
* Cart created if not exists
* Cart item created
* Correct quantity stored
* Correct total amount calculated


---

### Add Existing Product Again

Scenario:

User adds the same product multiple times.

Example:

Existing:


iPhone Case x2


Request:


Add iPhone Case x3


Expected Result:


iPhone Case x5


* Quantity increased
* No duplicate cart item created


---

### Product Not Found

Scenario:

Add product with invalid product ID.

Expected Result:

* HTTP 404 Not Found
* Product not found error


---

### Inactive Product

Scenario:

Product exists but status is not ACTIVE.

Expected Result:

* HTTP 400 Bad Request
* Product is not active error


---

### Insufficient Inventory

Scenario:

Requested quantity exceeds available stock.

Calculation:


Available = Quantity - Reserved


Expected Result:

* HTTP 400 Bad Request
* Insufficient stock error


---

# Get Cart


## Existing Cart

Scenario:

Authenticated user with cart items.

Expected Result:

* HTTP 200 OK
* Cart details returned
* Product information returned
* Correct subtotal calculation
* Correct total amount calculation


---

## Empty Cart

Scenario:

User has no cart.

Expected Result:

* HTTP 404 Not Found

or

* Empty cart response based on implementation


---

# Update Cart Quantity


Endpoint:


PATCH /cart/items/:productId



## Successful Quantity Update

Scenario:

Existing cart item.

Request:

```json
{
    "quantity":5
}

Expected Result:

HTTP 200 OK
Quantity updated
Total amount recalculated
Cart Not Found

Expected Result:

HTTP 404 Not Found
Cart Item Not Found

Scenario:

Product does not exist in user's cart.

Expected Result:

HTTP 404 Not Found
Invalid Quantity

Scenario:

Quantity:

0

or

negative value

Expected Result:

HTTP 400 Bad Request
Insufficient Inventory During Update

Scenario:

Requested quantity exceeds available stock.

Expected Result:

HTTP 400 Bad Request
Delete Cart Item

Endpoint:

DELETE /cart/items/:productId
Successful Delete

Expected Result:

HTTP 200 OK
Item removed from cart
Remaining cart returned
Delete Non-existing Item

Expected Result:

HTTP 404 Not Found
Replace Cart Items

Endpoint:

PUT /cart/items
Replace Existing Cart

Current Cart:

Product A x2
Product B x1
Product C x4

Request:

{
    "items":[
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

Expected Result:

Product B x5
Product D x2

Validation:

Product A removed
Product C removed
Product B updated
Product D created
Duplicate Products In Replace Request

Request:

{
    "items":[
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

Expected Result:

HTTP 400 Bad Request
Duplicate products are not allowed
Replace With Invalid Product

Expected Result:

HTTP 404 Not Found
Replace With Inactive Product

Expected Result:

HTTP 400 Bad Request
Replace With Insufficient Inventory

Expected Result:

HTTP 400 Bad Request
Authorization Testing
Without JWT

Scenario:

Call cart APIs without authentication token.

Expected Result:

HTTP 401 Unauthorized
Invalid JWT

Expected Result:

HTTP 401 Unauthorized
User Cart Isolation

Scenario:

User A attempts to access User B cart.

Expected Result:

User cannot access another user's cart
HTTP 404 Not Found
Transaction Testing
Replace Cart Transaction Failure

Scenario:

Failure occurs during:

Delete item
Update item
Create item

Expected Result:

Transaction rollback
No partial cart update
Database remains consistent
Response Validation

Verify:

Cart ID returned
Product details returned
Quantity correct
Unit price correct
Subtotal correct
Total amount correct

Example:

Unit Price × Quantity = Subtotal

Sum of Subtotal = Total Amount