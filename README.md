# Job Portal

Backend service for a job portal supporting recruiters, candidates, and public job browsing, built using clean layered architecture and phased development.

---

## 🚀 Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- TypeORM
- Zod (v4)
- JWT
- Jest (Unit & Integration Testing)

---

## 🧱 Architecture Overview

- Layered architecture:  
  `Entity → DTO → Repository → Service → Controller → Routes`
- Authentication via JWT (OTP + password)
- Role-based authorization via middleware
- Public read-only API layer (no JWT required)
- Ownership enforcement handled at service + repository level
- Centralized error handling
- Strict DTO validation using Zod
- Response mapping to prevent sensitive data leakage
- Explicit foreign key modeling for clean querying
- Composite uniqueness constraints at DB level
- Atomic DB updates where required (`increment`)
- Controlled lifecycle transitions using domain guards
- Aggregation handled at database level (no JS-side counting)
- Pagination with deterministic metadata
- SQL-level pagination (`limit` / `offset`) for raw queries
- Explicit projection for public APIs (no entity leakage)
- Content-Type enforcement for non-GET routes
- Deterministic integration test database lifecycle

---

## 📦 Implemented Phases

- Phase 0 – Foundation
- Phase 1 – Authentication
- Phase 2 – Authorization & Middleware
- Phase 2.1 – Profile Management
- Phase 3 – Job Posting (Recruiter)
- Phase 3.1 – Job Management (Update/Delete)
- Phase 3.2 – Testing & Hardening
- Phase 4 – Job Application (Candidate)
- Phase 4.1 – Application Management (Recruiter)
- Phase 5 – Dashboards & Aggregation APIs
- Phase 6 – Public Job Browsing APIs

> Detailed phase documentation is maintained in phase branches and project documentation.

---

## 📌 Current Capabilities

---

### 🌍 Public (Unauthenticated)

- Browse OPEN job listings (paginated)
- Search jobs (title + description)
- Filter jobs by:
  - Sector
  - Location
  - Experience level
- View public job details
- Fetch filter metadata (locations & experience levels)
- Deterministic ordering (`createdAt DESC`)
- No recruiter-private fields exposed
- No JWT required

#### Public Endpoints

```code
GET /api/v1/jobs
GET /api/v1/jobs/:id
GET /api/v1/jobs/filters
```

Public API Principles:

- Only `status = OPEN` jobs visible
- Explicit column projection
- Raw query mode with alias mapping
- Deterministic pagination
- Strict DTO validation
- 404 for CLOSED or non-existent jobs

---

### 👤 User (Shared)

- Sign up & authenticate via OTP or password
- Fetch own profile (`/me`)
- Update profile details (name, email, password)
- Soft delete (deactivate account)
- Email uniqueness enforced
- Sensitive fields excluded from API responses

---

### 🧑‍💼 Recruiter

- Create job postings (with location & experience level)
- View own job postings
- Fetch job details with ownership enforcement
- Update job (partial updates supported)
- Change job status (OPEN ↔ CLOSED)
- Delete job (hard delete)
- View applications for owned jobs (paginated)
- Update application status with lifecycle enforcement
- View recruiter dashboard overview (aggregated metrics)
- View per-job applicant breakdown with pagination
- Role strictly enforced via middleware

#### Recruiter Application Endpoints

```code
GET    /api/v1/recruiter/jobs/:jobId/applications
PATCH  /api/v1/recruiter/applications/:id/status
```

#### Recruiter Dashboard Endpoints

```code
GET /api/v1/recruiter/dashboard
GET /api/v1/recruiter/dashboard/overview
```

Features:

- Ownership validation (404 on cross-tenant access)
- Paginated response with meta
- SQL-level aggregation using `COUNT` + `FILTER`
- LEFT JOIN to include zero-application jobs
- Deterministic ordering
- No N+1 queries
- No data leakage across recruiters

---

### 🎓 Candidate

- Sign up & authenticate via OTP or password
- Fetch own profile
- Update candidate-specific profile details
- Apply to jobs
- View own applications
- One application per job enforced (DB + service level)
- View candidate dashboard summary
- View paginated applied jobs listing
- Role-protected routes

#### Candidate Endpoints

```code
POST /api/v1/applications/apply
GET  /api/v1/applications/me
```

#### Candidate Dashboard Endpoints

```code
GET /api/v1/candidate/dashboard
GET /api/v1/candidate/dashboard/applications
```

Features:

- Aggregated application summary (status breakdown)
- Paginated applied jobs listing
- SQL-level pagination using `limit` / `offset`
- ISO date normalization
- Strict ownership enforcement

---

## 📄 Application Module

### Core Features

- Explicit FK columns (`candidateId`, `jobPostingId`)
- Composite unique constraint `(jobPostingId, candidateId)`
- Default status: `APPLIED`
- Supported statuses:
  - APPLIED
  - SHORTLISTED
  - REJECTED
- Controlled lifecycle transitions via transition matrix
- Atomic applicant count increment
- Duplicate prevention (409 Conflict)
- Proper 404 handling for invalid jobs
- JWT-derived identity (candidate & recruiter)
- No status mutation during creation
- Paginated recruiter-side listing
- Domain-level transition guard (`isValidTransition`)

Pagination Response Shape:

```code
{
  data: [...],
  meta: {
    total,
    page,
    limit,
    totalPages
  }
}
```

---

## 📊 Dashboard & Aggregation Module (Phase 5)

### Recruiter Dashboard

- Total jobs (OPEN / CLOSED breakdown)
- Total applications with status distribution
- Per-job applicant aggregation
- LEFT JOIN + GROUP BY usage
- Parallel query execution using `Promise.all()`

### Candidate Dashboard

- Total applications summary
- Status distribution
- Paginated applied jobs listing
- SQL-level `limit` / `offset` for reliable pagination

### Aggregation Principles

- All counting performed at DB level
- PostgreSQL `FILTER` used for conditional counts
- `COUNT(column)` preferred over `COUNT(*)`
- No JS-side aggregation loops
- Deterministic ordering before pagination
- Separate total-count queries for grouped queries

---

## 🔐 Security & Hardening

- JWT verification middleware
- Role-based access control
- Ownership enforcement before mutations
- 404 returned for unauthorized resource ownership
- Strict DTO validation (reject unknown fields)
- Query param coercion via Zod (`z.coerce.number()`)
- Content-Type guard (`415 Unsupported Media Type`)
- Centralized error mapping
- Sensitive field filtering (password, OTP)
- Silent handling for invalid OTP requests
- Duplicate application prevention at DB level
- Controlled enum validation via Zod
- Lifecycle transitions validated at domain layer
- No cross-tenant aggregation leakage
- Public APIs strictly restricted to OPEN jobs
- Explicit projection to prevent accidental data exposure

---

## 🧪 Testing

### ✅ Unit Testing

- DTO validation
- Service logic (happy paths + edge cases)
- Lifecycle transition guard
- Controller behavior
- JWT middleware
- Role middleware

### ✅ Integration Testing

- Auth flows (signup, login, OTP)
- Profile flows (candidate, recruiter, user)
- Application apply flow
- Recruiter application listing
- Dashboard aggregation validation
- Pagination meta correctness
- Conflict scenarios
- Validation failures
- Role enforcement
- Content-Type enforcement
- Real database lifecycle per test

Testing stack:

- Jest
- Supertest
- Dedicated test DB
- Controlled schema reset
- Serial execution to prevent deadlocks

---

## 🏗️ Upcoming Work

- Advanced filtering & search optimization
- Performance indexing
- Load testing
- CI pipeline integration
- Full-text search support

---

## ▶️ Running Locally

Configure environment variables in:

```bash
environments/.env.staging
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run unit tests:

```bash
npm run test:unit
```

Run integration tests:

```bash
npm run test:integration
```

---

## 📌 Project Status

Backend foundation stabilized.

Core modules implemented and hardened.

System now supports:

- Public job browsing
- Secure role-based job posting
- Controlled application lifecycle
- Recruiter-side application management
- Aggregated recruiter dashboards
- Candidate dashboard summaries
- Deterministic pagination
- Clean aggregation patterns
- Strict domain separation
- Controlled public data exposure

Phase 6 complete and merged into `main`.
