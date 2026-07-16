# Profile Module Documentation

## Purpose

The Profile module stores additional user information separately from authentication data.

This separation keeps authentication and business domains independent.

---

# Module Structure


src/modules/profile

profile.controller.ts
profile.service.ts
profile.repository.ts
profile.module.ts

dto/
|
├── create-profile.dto.ts
└── profile-response.dto.ts


---

# Layer Responsibilities

## Controller

Responsibilities:

- Handle HTTP requests
- Apply authentication
- Receive DTO payload
- Return API response


## Service

Responsibilities:

- Apply business rules
- Coordinate repository calls
- Validate profile existence
- Convert database entities into response DTOs


## Repository

Responsibilities:

- Perform database operations
- Communicate with Prisma ORM

The repository does not contain business logic.

---

# Database Design

## UserProfile Model


User
|
|
UserProfile


Relationship:


User (1) ---- (0..1) UserProfile


---

# UserProfile Fields

| Field | Description |
|---|---|
| id | Profile identifier |
| userId | Related user identifier |
| firstName | User first name |
| lastName | User last name |
| phone | Optional phone number |
| createdAt | Creation timestamp |
| updatedAt | Update timestamp |

---

# Authentication Integration

Profile APIs use JWT authentication.

Request flow:


Client
|
Bearer Token
|
JwtAuthGuard
|
JwtStrategy
|
CurrentUser Decorator
|
Profile Service


JWT payload:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "CUSTOMER"
}

The sub value is used as userId.

API Details
Create Profile

Endpoint:

POST /profile

Request:

{
  "firstName": "Ahmer",
  "lastName": "One",
  "phone": "+971234567891"
}

Response:

{
  "id": "profile-id",
  "firstName": "Ahmer",
  "lastName": "One",
  "phone": "+971234567891"
}
Get Profile

Endpoint:

GET /profile

Response:

{
  "id": "profile-id",
  "firstName": "Ahmer",
  "lastName": "One",
  "phone": "+971234567891"
}
Error Handling
Profile Not Found

Condition:

Authenticated user does not have a profile.

Response:

HTTP 404

{
 "message": "Profile not found."
}
Future Enhancements
Update profile
Delete profile
Profile completion status
Avatar support
User preferences