# Sprint 5 Testing

## Order Creation

### Successful Order

* Valid authenticated user
* Active product
* Available inventory

Expected Result

* HTTP 201 Created
* Order created
* Order items created
* Inventory reserved

---

### Invalid Product

Expected Result

* HTTP 404 Not Found

---

### Inactive Product

Expected Result

* HTTP 400 Bad Request

---

### Duplicate Products

Expected Result

* HTTP 400 Bad Request

---

### Insufficient Inventory

Expected Result

* HTTP 400 Bad Request

---

## Get Order

### Existing Order

Expected Result

* HTTP 200 OK

---

### Non-existing Order

Expected Result

* HTTP 404 Not Found

---

### Access Another User's Order

Expected Result

* HTTP 404 Not Found

---

## Get Orders

### Pagination

* Page 1
* Page 2
* Custom limit

Expected Result

* Correct records returned
* Correct metadata

---

### Search

* Order ID
* Order Status

Expected Result

* Matching records returned

---

## Update Order Status

### Valid Transitions

* PENDING → CONFIRMED
* CONFIRMED → PAID
* PAID → SHIPPED
* SHIPPED → DELIVERED
* PENDING → CANCELLED

Expected Result

* HTTP 200 OK

---

### Invalid Transition

Example

DELIVERED → PENDING

Expected Result

* HTTP 400 Bad Request

---

### Inventory Validation

After PAID

* Quantity decreased
* Reserved decreased
* Available recalculated

After CANCELLED

* Reserved decreased
* Quantity unchanged

---

## Authorization

Customer

* Can create orders
* Can view own orders
* Cannot update order status

Administrator

* Can update order status

---

## Build Verification

* npm run build completed successfully
* No TypeScript compilation errors
* Prisma schema validated
* Migration executed successfully
