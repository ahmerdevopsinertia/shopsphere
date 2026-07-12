# Sprint 1 – Testing

## Overview

This document summarizes the manual testing performed during Sprint 1 to verify the authentication module.

---

# Registration API

## Test Case 1 — Successful Registration

**Request**

```
POST /auth/register
```

```json
{
  "email": "ahmer@example.com",
  "password": "Password1"
}
```

**Expected Result**

- HTTP Status: 201 Created
- User created successfully
- Password stored as bcrypt hash
- Password not returned in response

**Status**

✅ Passed

---

## Test Case 2 — Duplicate Email

**Expected Result**

- HTTP Status: 409 Conflict

```json
{
  "message": "Email is already registered."
}
```

**Status**

✅ Passed

---

## Test Case 3 — Invalid Password

Example:

```json
{
  "password": "123"
}
``