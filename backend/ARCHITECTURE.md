# Backend Architecture

## Overview

The backend is the authoritative platform API for the repository.

It owns:

- authentication
- authorization
- business rules
- persistence
- lifecycle simulation
- API contracts

The backend models internal-platform-style workflows around:

- projects
- environments
- deployments

It intentionally simulates provisioning and rollout behavior instead of performing real infrastructure orchestration.

---

## Design Goals

- clear API boundaries
- thin transport layer
- explicit business logic
- maintainable service structure
- safe evolution
- predictable lifecycle behavior

---

## High-Level Structure

```text
backend/
├── app/
│   ├── api/v1/         # route definitions and HTTP layer
│   ├── core/           # configuration, auth, shared app concerns
│   ├── models/         # ORM/domain persistence models
│   ├── repositories/   # data access layer
│   ├── schemas/        # request/response and validation schemas
│   ├── services/       # business logic and orchestration
│   └── main.py         # app entrypoint
├── tests/              # API and integration tests
├── pyproject.toml
└── Dockerfile
```

---

## Layer Responsibilities

### API Layer

Located in `app/api/v1/`.

Responsible for:

- defining endpoints
- parsing requests
- returning responses
- mapping errors into HTTP behavior
- delegating work to services

This layer should stay thin.  
It should not accumulate business rules.

### Core

Located in `app/core/`.

Responsible for shared application concerns such as:

- configuration
- authentication helpers
- security-related utilities
- common application wiring

### Models

Located in `app/models/`.

Responsible for persistence-oriented data structures.

These represent stored entities and database-facing structure.

### Repositories

Located in `app/repositories/`.

Responsible for data access.

This layer should:

- isolate persistence queries
- keep database interaction explicit
- avoid leaking database concerns into routes

### Schemas

Located in `app/schemas/`.

Responsible for:

- request validation
- response shapes
- typed API contracts

Schemas should stay explicit and should not become a dumping ground for business logic.

### Services

Located in `app/services/`.

Responsible for:

- application use cases
- orchestration
- lifecycle transitions
- business rules

This is the main place where domain behavior should live.

---

## Architectural Boundaries

### What belongs in the backend

- auth validation
- authorization decisions
- project ownership checks
- environment lifecycle rules
- deployment lifecycle rules
- persistence
- API contract enforcement
- final validation
- audit-relevant behavior

### What does not belong in the backend route layer

- complex business logic inside endpoints
- raw SQL or persistence details scattered in handlers
- duplicated validation across many routes
- silent side effects with unclear ownership

---

## Request Flow

A typical request should follow this shape:

1. route receives request
2. schema validates input
3. auth dependencies resolve principal
4. service executes business logic
5. repository performs persistence interaction
6. response schema returns stable output

This should remain explicit and easy to trace.

---

## Domain Model Intent

### Projects

Projects are the top-level user-owned unit.

They group environments and provide the main organizational boundary.

### Environments

Environments belong to a project.

They model long-lived or ephemeral runtime targets.

The backend controls lifecycle transitions such as provisioning to running.

### Deployments

Deployments target an environment.

They track a version or rollout attempt and move through simulated deployment states.

The backend owns deployment progression and final state transitions.

---

## Auth and Security

The backend is the source of truth for security decisions.

Rules:

- authentication is server-side
- authorization is server-side
- ownership checks are server-side
- input validation happens at the boundary
- client-side validation never replaces server validation

JWT handling, permission decisions, and protected resource access belong here, not in the frontend.

---

## Testing Expectations

The `tests/` directory should validate:

- auth behavior
- authorization boundaries
- project lifecycle behavior
- environment lifecycle behavior
- deployment lifecycle behavior
- error handling
- contract stability for important endpoints

When fixing a bug, add a regression test where practical.

---

## Evolution Rules

When changing the backend:

- preserve API behavior unless intentionally changing the contract
- keep route handlers thin
- keep service boundaries explicit
- do not move business rules into the frontend
- avoid mixing persistence concerns into HTTP handlers
- prefer incremental refactors over broad rewrites
- update this document if architectural responsibilities change