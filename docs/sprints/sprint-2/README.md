# Sprint 2 - User Profile Module

## Overview

Sprint 2 focuses on extending the authentication foundation by introducing the User Profile domain.

The objective of this sprint is to separate authentication-related information from user business information and establish a scalable user profile architecture.

---

# Sprint Goal

Build a dedicated Profile Module following the existing layered architecture:


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


---

# Scope Completed

## Profile Module

Implemented a dedicated Profile module responsible for managing user profile information.

Completed:

- Profile module creation
- Profile controller
- Profile service
- Profile repository
- Profile DTOs
- Database relationship between User and UserProfile

---

# Database Changes

Added `UserProfile` entity.

Relationship:


User (1) -------- (0..1) UserProfile


A user can have zero or one profile.

The profile table contains:

- First name
- Last name
- Phone number
- User reference

---

# APIs Implemented

## Create Profile


POST /profile


Creates a profile for the authenticated user.

Authentication:


Authorization: Bearer <access_token>


---

## Get Profile


GET /profile


Retrieves the profile of the currently authenticated user.

Authentication:


Authorization: Bearer <access_token>


---

# Architecture Decisions

## Separate Profile from User Entity

Authentication data and business profile data are separated.

User entity responsibilities:

- Email
- Password hash
- Role
- Authentication identity


Profile entity responsibilities:

- Personal information
- User details
- Future profile extensions

---

# Business Rules

- Profile creation requires authentication.
- Profile belongs to the authenticated user.
- User identity is taken from JWT payload.
- Users can retrieve only their own profile.
- Missing profile returns HTTP 404.

---

# Deferred Items

The following features are intentionally postponed:

- Update Profile API
- Delete Profile API
- Profile image management
- Address management

These will be implemented when required by the product roadmap.

---

# Sprint Outcome

Sprint 2 successfully established the user profile foundation required for future e-commerce featu