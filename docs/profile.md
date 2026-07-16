# Profile Module

## Overview

The Profile module manages user business information separately from authentication data.

The authentication system is responsible for identity and access management, while the Profile module stores additional user information required by the application.

The separation allows the system to evolve independently without mixing authentication concerns with user business data.

---

# Architecture

The Profile module follows the layered architecture pattern:


Controller
|
v
Service
|
v
Repository
|
v
Prisma ORM
|
v
Database


## Responsibilities

### Profile Controller

Responsible for:
- Handling HTTP requests
- Applying authentication guards
- Receiving DTO payloads
- Returning API responses

---

### Profile Service

Responsible for:
- Business logic
- Validating profile existence
- Mapping database entities to response DTOs
- Coordinating repository operations

---

### Profile Repository

Responsible for:
- Database operations
- UserProfile entity access
- Prisma queries

The repository does not contain business rules.

---

# Database Design

## User and UserProfile Relationship

A User can have zero or one Profile.

Relationship:


User
|
|
UserProfile


Database relationship:


User (1) -------- (0..1) UserProfile


## UserProfile Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Profile identifier |
| userId | UUID | Reference to User |
| firstName | String | User first name |
| lastName | String | User last name |
| phone | String | Optional phone number |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

---

# Prisma Relationship

The relation is implemented using:

```prisma
model UserProfile {
  id        String   @id @default(uuid())
  userId    String   @unique

  firstName String
  lastName  String
  phone     String?

  user User @relation(
    fields: [userId],
    references: [id],
    onDelete: Cascade
  )

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

The userId field is unique because one user can have only one profile.

Authentication Flow

Profile APIs are protected using JWT authentication.

Flow:

Client
 |
 | Bearer Token
 |
 v
JwtAuthGuard
 |
 v
JwtStrategy
 |
 v
CurrentUser Decorator
 |
 v
Profile Service

The authenticated user identity comes from:

{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "CUSTOMER"
}

The sub value is used as the userId when creating or retrieving profiles.

API Documentation
Create Profile
Endpoint
POST /profile
Authentication

Required:

Authorization: Bearer <access_token>
Request Body
{
  "firstName": "Ahmer",
  "lastName": "One",
  "phone": "+971234567891"
}
Response
{
  "id": "profile-id",
  "firstName": "Ahmer",
  "lastName": "One",
  "phone": "+971234567891"
}
Get Profile
Endpoint
GET /profile
Authentication

Required:

Authorization: Bearer <access_token>
Response
{
  "id": "profile-id",
  "firstName": "Ahmer",
  "lastName": "One",
  "phone": "+971234567891"
}
Error Handling
Profile Not Found

When an authenticated user does not have a profile:

HTTP Status:

404 Not Found

Response:

{
  "message": "Profile not found."
}
Design Decisions
Why separate Profile from User?

Authentication and profile information have different responsibilities.

User entity manages:

Email
Password hash
Role
Authentication identity

Profile entity manages:

Name
Phone
Future user preferences

This keeps the domain modular and easier to maintain.

Future Enhancements

Planned improvements:

Update profile API
Avatar management
Address management
User preferences
Profile completion percentage