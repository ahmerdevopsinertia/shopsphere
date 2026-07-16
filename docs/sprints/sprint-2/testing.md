---

# 3. `docs/sprints/sprint-2/testing.md`

```md
# Sprint 2 Testing Documentation

## Purpose

This document contains the verification scenarios executed for the Profile Module.

---

# Build Verification

Command:


npm run build


Result:


SUCCESS


The application compiled successfully without TypeScript errors.

---

# Production Build Verification

Command:


npm run start:prod


Result:


Application started successfully
Database connected successfully


---

# API Testing

## 1. Create Profile - Success

Endpoint:


POST /profile


Authentication:


Bearer Token


Request:

```json
{
 "firstName":"Ahmer",
 "lastName":"One",
 "phone":"+971234567891"
}

Result:

SUCCESS

Response:

{
 "id":"profile-id",
 "firstName":"Ahmer",
 "lastName":"One",
 "phone":"+971234567891"
}
2. Get Profile - Success

Endpoint:

GET /profile

Authentication:

Bearer Token

Result:

SUCCESS

3. Unauthorized Request

Scenario:

Request without JWT token.

Endpoint:

GET /profile

Response:

HTTP 401

{
 "message":"Unauthorized",
 "statusCode":401
}
4. Profile Not Found

Scenario:

Authenticated user without profile.

Expected:

HTTP 404

{
 "message":"Profile not found."
}
Sprint 2 Testing Result

All implemented Profile Module features are working successfully.