# Sprint 1 – Identity & Authentication

## Sprint Goal

Build the authentication foundation for ShopSphere using NestJS, Prisma, PostgreSQL and JWT.

## Features Delivered

- User Registration API
- User Login API
- Password Hashing using bcrypt
- JWT Access Token Generation
- JWT Validation Strategy
- JWT Authentication Guard
- Protected User Profile Endpoint
- CurrentUser Decorator

## APIs Implemented

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Authenticate user and return JWT |
| GET | /users/profile | Protected endpoint returning authenticated user |

## Technologies

- NestJS
- Prisma ORM
- PostgreSQL
- Passport JWT
- bcrypt
- class-validator
- ConfigModule

## Sprint Outcome

Successfully implemented a production-ready authentication foundation that will be extended with Refresh Tokens, Role-Based Access Control (RBAC), Email Verification and Password Reset in future sprints.