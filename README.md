# Job Portal

Full-stack job portal supporting **recruiters, candidates, and public job browsing**, built using **clean layered backend architecture** and **feature-based scalable frontend architecture**.

The project is developed using **phased backend and frontend development**, where each phase introduces a well-defined capability.

---

## 🚀 Tech Stack

### Backend Stack

* Node.js
* TypeScript
* Express
* PostgreSQL
* TypeORM
* Zod (v4)
* JWT
* Jest (Unit & Integration Testing)

### Frontend Stack

* React
* Vite
* TypeScript
* React Router
* Axios
* React Query (TanStack Query)
* Bootstrap
* Bootstrap Icons

---

## 🧱 Architecture Overview

### Backend Architecture

Layered architecture:

```code
Entity → DTO → Repository → Service → Controller → Routes
```

Key principles:

* Authentication via JWT (OTP + password)
* Role-based authorization via middleware
* Public read-only API layer (no JWT required)
* Ownership enforcement handled at service + repository level
* Centralized error handling
* Strict DTO validation using Zod
* Response mapping to prevent sensitive data leakage
* Explicit foreign key modeling for clean querying
* Composite uniqueness constraints at DB level
* Atomic DB updates where required (`increment`)
* Controlled lifecycle transitions using domain guards
* Aggregation handled at database level
* Deterministic pagination metadata
* SQL-level pagination (`limit` / `offset`)
* Explicit projection for public APIs
* Content-Type enforcement for non-GET routes
* Deterministic integration test database lifecycle

---

### Frontend Architecture

Feature-based architecture designed for **scalability and maintainability**.

```code
src
├ app
│  ├ router
│  │  ├ index.tsx
│  │  ├ PublicRoutes.tsx
│  │  ├ ProtectedRoutes.tsx
│  │  └ ProtectedRoute.tsx
│  │
│  └ providers
│     └ QueryProvider.tsx
│
├ api
│  └ axios.ts
│
├ features
│  ├ auth
│  ├ candidate
│  ├ recruiter
│  └ jobs
│
├ shared
│  ├ components
│  ├ hooks
│  └ types
```

Frontend principles:

* Feature-based modular architecture
* Centralized API client
* Global authentication context
* Public and protected route separation
* Route guards for authenticated pages
* React Query for server state management
* Reusable shared utilities
* Strict separation between infrastructure and features

---

## 📦 Implemented Phases

### Backend

* Phase 0 – Foundation
* Phase 1 – Authentication
* Phase 2 – Authorization & Middleware
* Phase 2.1 – Profile Management
* Phase 3 – Job Posting (Recruiter)
* Phase 3.1 – Job Management (Update/Delete)
* Phase 3.2 – Testing & Hardening
* Phase 4 – Job Application (Candidate)
* Phase 4.1 – Application Management (Recruiter)
* Phase 5 – Dashboards & Aggregation APIs
* Phase 6 – Public Job Browsing APIs

### Frontend

* Phase 0 – Project Foundation

> Detailed documentation for each phase exists in its respective branch.

---

## 🌐 API Routes

---

### 🔐 Auth Routes

| Method | Endpoint                       |
| ------ | ------------------------------ |
| POST   | /api/v1/auth/signup/recruiter  |
| POST   | /api/v1/auth/signup/candidate  |
| POST   | /api/v1/auth/login/password    |
| POST   | /api/v1/auth/login/otp/request |
| POST   | /api/v1/auth/login/otp/resend  |
| POST   | /api/v1/auth/login/otp/verify  |

---

### 🎓 Candidate Routes

| Method | Endpoint                                 |
| ------ | ---------------------------------------- |
| GET    | /api/v1/candidate/me                     |
| PATCH  | /api/v1/candidate/me                     |
| GET    | /api/v1/candidate/dashboard              |
| GET    | /api/v1/candidate/dashboard/applications |

---

### 🧑‍💼 Recruiter Routes

| Method | Endpoint                                  |
| ------ | ----------------------------------------- |
| GET    | /api/v1/recruiter/me                      |
| PATCH  | /api/v1/recruiter/me                      |
| GET    | /api/v1/recruiter/jobs/:id/applications   |
| PATCH  | /api/v1/recruiter/applications/:id/status |
| GET    | /api/v1/recruiter/dashboard               |
| GET    | /api/v1/recruiter/dashboard/overview      |

---

### 👤 User Routes

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /api/v1/user/me |
| PATCH  | /api/v1/user/me |
| DELETE | /api/v1/user/me |

---

### 💼 Job Routes

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/v1/jobs     |
| GET    | /api/v1/jobs/me  |
| GET    | /api/v1/jobs/:id |
| PATCH  | /api/v1/jobs/:id |
| DELETE | /api/v1/jobs/:id |

---

### 📄 Application Routes

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | /api/v1/applications/apply |
| GET    | /api/v1/applications/me    |

---

### 🌍 Public Routes

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/v1/jobs         |
| GET    | /api/v1/jobs/filters |
| GET    | /api/v1/jobs/:id     |

---

## 🌍 Public Job Browsing

Public APIs allow anyone to browse jobs without authentication.

Capabilities:

* Browse OPEN job listings (paginated)
* Search jobs (title + description)
* Filter by sector, location, experience level
* View job details
* Fetch filter metadata
* Deterministic ordering (`createdAt DESC`)

Public endpoints:

```code
GET /api/v1/jobs
GET /api/v1/jobs/:id
GET /api/v1/jobs/filters
```

Security guarantees:

* Only `status = OPEN` jobs visible
* Explicit column projection
* No recruiter private data
* Strict DTO validation
* 404 returned for non-visible jobs

---

## 🎓 Candidate Capabilities

Candidates can:

* Sign up via OTP or password
* Manage profile
* Apply to jobs
* View own applications
* Access candidate dashboard

Features:

* One application per job enforced
* Paginated applied jobs listing
* Status distribution summary
* Ownership enforcement

---

## 🧑‍💼 Recruiter Capabilities

Recruiters can:

* Create job postings
* Update job details
* Close/open job listings
* Delete jobs
* View applications for their jobs
* Update application status
* View recruiter dashboard analytics

Features:

* Ownership validation
* Aggregated applicant metrics
* Deterministic pagination
* No cross-tenant data leakage

---

## 📊 Dashboards & Aggregation

### Recruiter Dashboard

* Total jobs (OPEN/CLOSED)
* Total applications
* Status breakdown
* Per-job applicant counts

### Candidate Dashboard

* Application summary
* Status distribution
* Paginated applied jobs listing

Aggregation rules:

* All counting done at DB level
* PostgreSQL `FILTER` used
* Deterministic ordering
* No JS-side aggregation

---

## 🔐 Security & Hardening

Security measures include:

* JWT verification middleware
* Role-based access control
* Ownership validation
* Strict DTO validation
* Content-Type enforcement
* Centralized error handling
* Sensitive field filtering
* Duplicate application prevention
* Controlled lifecycle transitions
* Cross-tenant protection
* Public API projection safety

---

## 🧪 Testing

### Unit Testing

* DTO validation
* Service logic
* Controller behavior
* JWT middleware
* Role middleware
* Domain guards

### Integration Testing

* Auth flows
* Profile flows
* Job application flows
* Recruiter management flows
* Dashboard aggregations
* Pagination metadata validation
* Conflict and validation scenarios

Testing stack:

* Jest
* Supertest
* Dedicated test database
* Deterministic schema reset

---

## 🏗️ Upcoming Work

Planned improvements:

* Frontend authentication UI
* Job browsing UI
* Application management UI
* Advanced search & filtering
* Performance indexing
* CI pipeline integration
* Full-text search support
* Load testing

---

## ▶️ Running Locally

Configure environment variables:

```code
environments/.env.staging
```

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm run dev
```

Run tests:

```bash
npm run test:unit
npm run test:integration
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Project Status

Backend system is **fully implemented and stabilized through Phase 6**.

Frontend **foundation architecture completed (Phase 0)**.

Current capabilities include:

* Public job browsing
* Role-based job posting
* Controlled application lifecycle
* Recruiter application management
* Recruiter dashboards
* Candidate dashboards
* Deterministic pagination
* Secure multi-tenant data access
* Clean backend architecture
* Scalable frontend foundation

The project is now ready for **frontend feature development starting with authentication UI**.
