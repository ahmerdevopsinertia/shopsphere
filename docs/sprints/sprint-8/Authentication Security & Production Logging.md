# Refresh Token Security

## Architecture

User Login

↓

Access Token generated

↓

Refresh Token generated

↓

Refresh Token Identifier (jti)

↓

bcrypt hash

↓

Stored in RefreshToken table

---

## Refresh Flow

Client sends Refresh Token

↓

JWT verification

↓

Retrieve active Refresh Token

↓

Compare bcrypt hash

↓

Revoke previous Refresh Token

↓

Generate new Access Token

↓

Generate new Refresh Token

↓

Store new hashed Refresh Token

↓

Return new tokens

---

## Security Features

- Access Token and Refresh Token use different secrets
- Refresh Tokens are never stored in plaintext
- Refresh Token rotation implemented
- Revoked tokens cannot be reused
- Refresh Token expiration enforced

---

# Logging

Implemented

- Structured logging
- Global exception logging
- Request logging
- Security logging
- Refresh Token lifecycle logging

Sensitive Data Redacted

- Authorization header
- Cookies
- Gateway API Key
- Password
- Password Hash
- Refresh Token

---

# Environment Variables

JWT_ACCESS_SECRET

JWT_ACCESS_EXPIRES_IN

JWT_REFRESH_SECRET

JWT_REFRESH_EXPIRES_IN

LOG_LEVEL

NODE_ENV

RUN_SEED