# API Route Classification Overview

This document describes the **API route classification strategy** used in the system.
Routes are grouped by **trust level, actor type, and responsibility** to ensure clarity,
security, and maintainability.

The routing strategy is designed to:
- Enforce clear security boundaries
- Reduce authorization mistakes
- Make intent explicit at the API level
- Scale cleanly as the system grows

---

# Table of Contents

- [Overview](#overview)
- [Route Types](#route-types)
  - [Public Routes](#public-routes)
  - [Shared Routes](#shared-routes)
  - [User Routes](#user-routes)
  - [Admin Routes](#admin-routes)
  - [System Routes](#system-routes)
- [Route Comparison Matrix](#route-comparison-matrix)
- [Best Practices](#best-practices)
- [Common Mistakes](#common-mistakes)

---

## Overview

Each API route belongs to **exactly one category**.
The category determines:

- Who can call the API
- What authentication is required
- What data scope is allowed
- What level of validation and auditing is needed

This is not only a security model, but also a **communication tool** for developers.

---

## Route Types

### Public Routes

**Audience**
- Anonymous users
- Internet-facing clients

**Authentication**
- ❌ No authentication

**Characteristics**
- Zero trust
- High risk
- Must be rate-limited and monitored

**Typical Use Cases**
- Sign up
- Sign in
- Refresh token
- Forgot password
- Verify email

**Example Paths**
- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `POST /auth/refresh-token`

**Notes**
- Never expose internal IDs
- Avoid returning sensitive error details

---

### Shared Routes

**Audience**
- Authenticated users (any role)
- Internal reuse

**Authentication**
- ✅ Required

**Characteristics**
- Role-agnostic
- Read-only or utility-focused

**Typical Use Cases**
- Upload files
- Fetch enums / metadata
- Read common configuration
- Get current profile (read-only)

**Example Paths**
- `GET /shared/enums`
- `POST /shared/upload`
- `GET /shared/profile`

**Notes**
- No business ownership of data
- No cross-user mutation

---

### User Routes

**Audience**
- End users

**Authentication**
- ✅ Required (User JWT)

**Characteristics**
- Self-scoped
- Cannot affect other users

**Typical Use Cases**
- Update profile
- Change password
- View own sessions
- Logout

**Example Paths**
- `PATCH /user/profile`
- `PATCH /user/change-password`
- `GET /user/sessions`

**Rules**
- User can only access their own data
- User ID must come from token, not request params

---

### Admin Routes

**Audience**
- System administrators
- Operators

**Authentication**
- ✅ Required (Admin JWT)
- ✅ Role-based authorization

**Characteristics**
- Global scope
- High privilege
- Strict audit logging required

**Typical Use Cases**
- Create users
- Block / unblock users
- Reset user passwords
- View system metrics

**Example Paths**
- `POST /admin/users`
- `PATCH /admin/users/:id/block`
- `POST /admin/users/:id/reset-password`

**Notes**
- Never reuse user routes for admin actions
- Always log actor + target

---

### System Routes

**Audience**
- Internal services
- Cron jobs
- Background workers

**Authentication**
- 🔐 API Key / mTLS / Internal token

**Characteristics**
- Fully trusted caller
- No UI constraints
- Can bypass some validations

**Typical Use Cases**
- Data synchronization
- Automatic account updates
- Cleanup jobs
- System migrations

**Example Paths**
- `POST /system/users/sync`
- `PATCH /system/users/auto-block`
- `POST /system/sessions/cleanup`

**Notes**
- Must never be exposed publicly
- Separate deployment access if possible

---

## Route Comparison Matrix

| Route Type | Actor        | Auth Required | Scope        | Risk Level |
|-----------|--------------|---------------|--------------|------------|
| Public    | Anonymous    | ❌ No         | None         | 🔥🔥🔥 |
| Shared    | Mixed        | ✅ Yes        | Neutral      | 🔥🔥 |
| User      | End user     | ✅ Yes        | Self only    | 🔥 |
| Admin     | Operator     | ✅ Yes (RBAC) | Global       | 🔥🔥 |
| System    | Machine      | 🔐 Strong     | Full         | 🔥🔥🔥🔥 |

---

## Best Practices

- One route = one responsibility
- Never mix admin and user behavior in the same endpoint
- Validate permissions at the route layer
- Keep business logic in services, not controllers
- Log aggressively for admin and system routes

---

## Common Mistakes

- Using user routes for admin actions
- Passing userId from request instead of token
- Overloading shared routes with business logic
- Skipping audit logs for privileged actions

---

## Final Note

Routes are **contracts**, not just URLs.
A well-designed route structure prevents bugs,
security issues, and architectural debt.

