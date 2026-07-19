# Sprint 3 - Product Catalog & Authorization

## Objective

Implement the product catalog foundation with category management,
pagination, authentication, and role-based authorization.

---

## Completed Features

### Product Module

- Create Product API
- Get Product By ID API
- Get Products API with pagination and Search capability
- SKU uniqueness validation
- Category existence validation
- Decimal price handling

---

### Category Module

- Create Category API
- Get Categories API
- Automatic slug generation
- Duplicate category validation

---

### Security

- JWT Authentication
- JWT Protected routes
- Role Based Access Control (RBAC)
- ADMIN-only product/category creation

---

## Architecture

Controller
    |
Service
    |
Repository
    |
Prisma
    |
PostgreSQL

---

## Key Decisions

- Product creation requires ADMIN role
- Product listing remains public
- Category validation handled through CategoryRepository
- Pagination introduced from initial catalog design