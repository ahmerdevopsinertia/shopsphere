# Sprint 4 Testing

## Create Inventory

✅ Product exists

✅ Duplicate inventory returns 409 Conflict

✅ Unknown product returns 404 Not Found

---

## Get Inventory

✅ Existing inventory returned successfully

✅ Unknown inventory returns 404 Not Found

---

## Update Inventory

## Update Inventory

✅ Increase stock using a positive change

```json
{
  "change": 50
}
```

✅ Decrease stock using a negative change

```json
{
  "change": -20
}
```

✅ Prevent quantity from becoming less than reserved stock

✅ Unknown inventory returns 404 Not Found

✅ Invalid UUID returns 400 Bad Request

✅ Invalid DTO validation

✅ Unknown request properties rejected

---

## Product APIs

✅ Product includes inventory

✅ Products without inventory return

inventory: null

---

## Validation

✅ Invalid DTO rejected

✅ Unknown properties rejected

✅ UUID validation

✅ Quantity validation

---

## Build

npm run build

✅ Passed

---

## Manual Testing

Completed using Postman.