# PHASE-WISE DEVELOPMENT PLAN

## Phase 2: Authorization & Middleware

🎯 Goal

Protect the system before adding features.

Build

- auth.middleware.ts (JWT)

- role.middleware.ts (recruiter / candidate)

Test

- Recruiter cannot access candidate APIs

- Candidate cannot create jobs

🚨 Never add features before this.

---

### Files Added / Modified in Phase 2

#### 1️⃣ auth.middleware.ts ✅ (ADDED / FINALIZED)

Purpose

- Authenticate requests using JWT

- Establish trusted identity (`req.user`)

Key Changes

- Read `Authorization: Bearer <token>` header

- Verify JWT using `jwt.verify`

- Extract { sub, role } from payload

- Normalize and attach:

  ```bash
  req.user = { id: sub, role }
  ```

- Handle all failures with 401 Unauthorized

- No DB calls, no role checks

#### 2️⃣ role.middleware.ts ✅ (ADDED)

Purpose

- Enforce role-based authorization (RBAC)

Key Changes

- Introduced higher-order middleware:

  ```bash
  requireRole("recruiter")
  requireRole("candidate")
  ```

- Uses closure to remember allowed roles

- Reads only req.user.role

- Returns:

  - 401 if req.user missing

  - 403 if role mismatch

- No JWT logic, no DB access

#### 3️⃣ auth.types.ts ✅ (ADDED)
Purpose

- Define authenticated user contract (auth domain)

Added

```typescript
export interface AuthenticatedUser {
  id: string;
  role: 'recruiter' | 'candidate';
}
```

Notes

- Minimal by design

- Separate from DB user entity

#### 4️⃣ express.d.ts (or equivalent) ✅ (ADDED)

Purpose

- Type-safe access to req.user across app

Change

- Augmented Express Request:

  ```typescript
  interface Request {
    user?: AuthenticatedUser;
  }
  ```

Effect

- No casting

- Full IntelliSense in middleware & controllers

#### 5️⃣ auth.routes.ts ❌ (NO AUTH MIDDLEWARE APPLIED)

Status

- Intentionally unchanged

Reason

- All auth routes are public:

  - login

  - register

  - otp flows

- `verifyJwt` / `requireRole` must NOT run here

#### 6️⃣ README.md ✅ (MODIFIED)

Purpose

- Documented steps followed in Phase 2
