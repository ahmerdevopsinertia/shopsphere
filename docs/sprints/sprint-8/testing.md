# Sprint 8 Testing

## Login API

### Request

POST /auth/login

Expected

- HTTP 200
- Access Token returned
- Refresh Token returned
- Refresh Token stored in database

---

## Refresh Token Database

Verify:

- tokenHash stored
- revoked = false
- expiresAt populated
- userId correct

---

## Refresh API

POST /auth/refresh

Expected

- HTTP 200
- New Access Token
- New Refresh Token
- Old Refresh Token revoked
- New Refresh Token stored

---

## Refresh Token Rotation

Database verification

Old Token

revoked = true

New Token

revoked = false

---

## Invalid Refresh Token

Expected

HTTP 401

Message

Invalid refresh token

---

## Logging

Verify

- Product creation logs
- Exception logs
- Refresh Token logs
- Request logs

Verify redaction

Authorization Header

Cookie

Gateway API Key

Passwords

Refresh Tokens

---

## Docker

Verify

- Container starts
- Prisma migration runs
- Seed executes (development)
- Backend starts
- Logging works

---

Sprint 8 Result

PASS