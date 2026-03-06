# Frontend Architecture

## Overview

The frontend is a thin Angular client for the backend API.

It provides user-facing flows for:

- authentication
- project management
- environment management
- deployment tracking

The frontend coordinates user actions and renders backend state.  
It is not the source of truth for business rules.

---

## Design Goals

- thin client
- explicit API boundaries
- predictable state handling
- maintainable feature structure
- minimal duplicated business logic
- safe incremental evolution

---

## High-Level Structure

```text
frontend/src/
├── app/
│   ├── core/           # auth, guards, interceptors, app-level concerns
│   ├── features/       # auth, projects, environments, deployments
│   ├── shared/         # reusable components and shared models
│   ├── layout/         # shell and navigation
│   └── app.routes.ts   # routing
├── environments/       # runtime environment configuration
└── styles.css          # global styles
```

---

## Layer Responsibilities

### Core

Responsible for cross-cutting frontend concerns such as:

- auth state
- guards
- interceptors
- shared app-level plumbing

### Features

Responsible for user-facing domain slices such as:

- auth
- projects
- environments
- deployments

Each feature should keep its own views, feature services, and UI behavior together where practical.

### Shared

Responsible for:

- reusable components
- shared display helpers
- shared models and interfaces

Only place things here when reuse is real.

### Layout

Responsible for:

- shell layout
- navigation
- header-level concerns

---

## Frontend Boundaries

### The frontend owns

- rendering
- local interaction state
- route transitions
- form behavior
- API invocation
- loading, success, and error states
- polling or refresh behavior where the UX requires it

### The frontend does not own

- authorization decisions
- lifecycle business rules
- persistence
- final validation
- simulated provisioning or rollout logic

The backend remains authoritative.

---

## API Interaction Model

Typical flow:

1. user performs an action
2. component collects input
3. service calls backend API
4. loading state is shown
5. success or error state is rendered
6. data is refreshed from backend truth

The UI should never assume success before the backend confirms it.

---

## Authentication Model

The frontend participates in auth flows by:

- submitting credentials
- storing normal client-side auth state
- attaching the token to API requests
- guarding routes for UX purposes

The backend still validates tokens and permissions.

Route guards improve usability but do not provide real security.

---

## Status Tracking

Environment and deployment status is backend-driven.

The frontend may poll or refresh to show updated state, but it must treat the backend as authoritative.

Rules:

- polling should be intentional
- polling should stop when unnecessary
- UI states should match documented backend behavior
- lifecycle assumptions should not be reimplemented independently in the client

---

## State Management

Keep state as local as possible.

Prefer:

- local state for local UI concerns
- feature-scoped services for API coordination
- derived UI state over duplicated backend truth

Avoid:

- unnecessary global state
- duplicated copies of the same backend data
- domain logic hidden inside presentation components

---

## Component Rules

Components should:

- stay focused on presentation and interaction
- avoid becoming large god-components
- delegate API behavior to services
- avoid embedding backend business rules

Reusable components should exist only when the reuse is meaningful.

---

## Error Handling

Every important user flow should handle:

- loading
- validation error
- unauthorized
- forbidden
- empty state where relevant
- network failure
- unexpected server failure

Errors shown to users should be safe and understandable.

Do not expose backend internals, stack traces, or technical diagnostics unnecessarily.

---

## Evolution Rules

When changing the frontend:

- preserve existing flows unless intentionally changing behavior
- keep the frontend thin
- do not migrate domain rules from backend into Angular code
- update this document if boundaries or structure change
- prefer incremental refactors over rewrites