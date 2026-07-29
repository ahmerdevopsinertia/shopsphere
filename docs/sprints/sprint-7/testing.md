# Sprint 7 Testing

## Checkout

### Successful Checkout

Requirements

* Valid JWT
* Existing cart
* Cart contains products
* Active products
* Sufficient inventory

Expected Result

* HTTP 201 Created
* Order created
* Order items created
* Inventory reserved
* Cart cleared
* Payment status is PENDING
* Payment reference generated

---

## Empty Cart

Expected Result

* HTTP 400 Bad Request

---

## Cart Not Found

Expected Result

* HTTP 404 Not Found

---

## Product Not Found

Expected Result

* HTTP 404 Not Found

---

## Product Inactive

Expected Result

* HTTP 400 Bad Request

---

## Inventory Not Found

Expected Result

* HTTP 404 Not Found

---

## Insufficient Inventory

Expected Result

* HTTP 400 Bad Request

---

## Transaction Rollback

Simulate a failure during:

* Order Item Creation
* Inventory Reservation
* Cart Clearing

Expected Result

* No order created
* No inventory reserved
* Cart remains unchanged

---

## Payment Preparation

Verify

* paymentStatus = PENDING
* paymentReference generated
* Unique payment reference for every checkout

---

## Authorization

Customer

* Can perform checkout

Anonymous User

* Unauthorized

Expected Result

* HTTP 401 Unauthorized

---

## Build Verification

* npm run build completed successfully
* No TypeScript compilation errors
* Prisma schema validated
* Migration executed successfully
* Checkout transaction tested successfully