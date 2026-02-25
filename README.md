# Job Portal

Backend service for a job portal supporting recruiters and candidates, built using clean layered architecture and phased development.

---

## 🚀 Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- TypeORM
- Zod
- JWT
- Jest (Unit & Integration Testing)

---

## 🧱 Architecture Overview

- Layered architecture:
  Entity → DTO → Repository → Service → Controller → Routes
- Authentication via JWT (OTP + password)
- Role-based authorization via middleware
- Ownership enforcement handled at query level
- Centralized error handling
- Strict DTO validation using Zod
- Response mapping to prevent sensitive data leakage
- Database access via TypeORM
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

> Detailed phase documentation is maintained in phase branches and project documentation.

---

## 📌 Current Capabilities

### 👤 User (Shared)

- Sign up & authenticate via OTP or password
- Fetch own profile (`/me`)
- Update profile details (name, email, password)
- Soft delete (deactivate account)
- Email uniqueness enforced
- Sensitive fields excluded from API responses

---

### 🧑‍💼 Recruiter

- Create job postings
- View own job postings
- Fetch job details with ownership enforcement
- Update job (partial updates supported)
- Change job status (OPEN ↔ CLOSED)
- Delete job (hard delete)
- Role strictly enforced via middleware

---

### 🎓 Candidate

- Sign up & authenticate via OTP or password
- Fetch own profile
- Update candidate-specific profile details
- Role-protected routes

---

## 🔐 Security & Hardening

- JWT verification middleware
- Role-based access control
- Ownership enforcement in repository queries
- Strict DTO validation (reject unknown fields)
- Content-Type guard (`415 Unsupported Media Type`)
- Centralized error mapping
- Sensitive field filtering (password, OTP, timestamps)
- Silent handling for invalid OTP requests

---

## 🧪 Testing

### ✅ Unit Testing

- DTO validation
- Service logic (happy paths + edge cases)
- Controller behavior
- JWT middleware
- Role middleware

### ✅ Integration Testing

- Auth flows (signup, login, OTP)
- Profile flows (candidate, recruiter, user)
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

- Phase 4 – Job Applications (Candidate Side)
- Phase 5 – Dashboard & Aggregation APIs
- Job module integration coverage
- Application module integration coverage
- Public job browsing endpoints
- Performance optimizations
- Load testing
- CI pipeline integration

---

## ▶️ Running Locally

Configure environment variables in:

environments/.env.staging

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
Run integration tests:
```

## 📌 Project Status

Backend foundation stabilized.

Core modules implemented and hardened.

Ready for Phase 4 feature expansion.

---

This version reflects:

- Phase 3.2 completed
- Testing included
- Hardening added
- Deferred job/application testing correctly positioned
- Clean main-branch documentation

You’re now officially transitioning into feature expansion phase.