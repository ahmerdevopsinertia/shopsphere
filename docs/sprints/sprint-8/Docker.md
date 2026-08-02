# Docker Documentation

## Overview

ShopSphere is fully containerized using Docker and Docker Compose.

The application consists of two containers:

- Backend (NestJS)
- PostgreSQL Database

Docker provides:

- Consistent development environment
- Isolated dependencies
- Simplified onboarding
- Production-ready deployment
- CI/CD compatibility

---

# Architecture

```
                Docker Network
----------------------------------------------------

        +-------------------------+
        |     NestJS Backend      |
        |        Port 3000        |
        +-----------+-------------+
                    |
                    |
                    |
        +-----------v-------------+
        |      PostgreSQL         |
        |        Port 5432        |
        +-------------------------+

----------------------------------------------------
```

---

# Project Structure

```
backend/

├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
├── .dockerignore
├── .env.docker
└── prisma/
```

---

# Docker Components

## Dockerfile

Responsible for:

- Installing dependencies
- Building NestJS
- Generating Prisma Client
- Producing production image

Uses:

- Multi-stage build
- Node.js 22 Alpine

---

## docker-compose.yml

Creates:

- Backend Container
- PostgreSQL Container

Responsibilities

- Networking
- Volumes
- Environment variables
- Container startup order

---

## docker-entrypoint.sh

Executed every time the backend container starts.

Responsibilities

1. Wait for PostgreSQL
2. Run Prisma migrations
3. Seed database (optional)
4. Start NestJS

Flow

```
Container Starts
        │
        ▼
Prisma migrate deploy
        │
        ▼
RUN_SEED ?
        │
   Yes / No
        │
        ▼
Start NestJS
```

---

# Environment Variables

## Database

```
DATABASE_URL=postgresql://postgres:12345@postgres:5432/shopsphere
```

---

## JWT

### Access Token

```
JWT_ACCESS_SECRET=xxxxxxxx

JWT_ACCESS_EXPIRES_IN=15m
```

---

### Refresh Token

```
JWT_REFRESH_SECRET=xxxxxxxx

JWT_REFRESH_EXPIRES_IN=30d
```

---

## Logging

```
LOG_LEVEL=debug
```

Available values

- trace
- debug
- info
- warn
- error

Production

```
LOG_LEVEL=info
```

---

## Node Environment

Development

```
NODE_ENV=development
```

Production

```
NODE_ENV=production
```

---

## Database Seed

```
RUN_SEED=true
```

Development

```
true
```

Production

```
false
```

---

# Docker Commands

## Build

```
docker compose build --no-cache
```

---

## Start

```
docker compose up
```

Detached

```
docker compose up -d
```

---

## Stop

```
docker compose down
```

---

## Restart

```
docker compose restart
```

---

## Rebuild

```
docker compose down

docker compose build --no-cache

docker compose up
```

---

## View Running Containers

```
docker ps
```

---

## Backend Logs

```
docker logs -f shopsphere-backend
```

---

## PostgreSQL Logs

```
docker logs -f shopsphere-postgres
```

---

## Execute Shell

Backend

```
docker exec -it shopsphere-backend sh
```

Database

```
docker exec -it shopsphere-postgres psql -U postgres -d shopsphere
```

---

# Prisma

Run migrations manually

```
npx prisma migrate deploy
```

Generate Prisma Client

```
npx prisma generate
```

Seed

```
npx prisma db seed
```

---

# Docker Volumes

Persistent PostgreSQL storage is managed using Docker Volumes.

Benefits

- Database survives container restart
- Faster development
- Safe rebuilds

---

# Networking

Docker Compose automatically creates an internal network.

Backend connects using:

```
postgres
```

NOT

```
localhost
```

Example

```
DATABASE_URL=postgresql://postgres:12345@postgres:5432/shopsphere
```

---

# Logging

Application uses:

- nestjs-pino
- pino-http

Structured logs include

- Request ID
- HTTP Method
- URL
- Response Time
- Status Code
- Stack Trace
- Security Events

Sensitive data is automatically redacted.

---

# Security Notes

Never commit

- .env
- Secrets
- Production credentials

Use

```
.env.example
```

for documentation.

---

# Production Recommendations

- Disable RUN_SEED
- Use strong JWT secrets
- Enable HTTPS
- Use Docker Secrets or Secret Manager
- Set NODE_ENV=production
- LOG_LEVEL=info
- Keep Docker images updated

---

# Troubleshooting

## Build Issues

```
docker compose build --no-cache
```

---

## Clean Docker Cache

```
docker system prune -a
```

---

## Remove Containers

```
docker compose down -v
```

---

## Check Running Containers

```
docker ps
```

---

## Verify Database Connection

```
docker exec -it shopsphere-postgres psql -U postgres -d shopsphere
```

---

# Current Status

Docker Integration Status

- Multi-stage Docker Build
- Docker Compose
- PostgreSQL Container
- NestJS Container
- Prisma Migrations
- Database Seeding
- Structured Logging
- Environment Configuration
- Production Ready