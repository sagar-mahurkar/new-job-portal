# Phase 4 – Job Application (Candidate side)

> Branch: `backend-phase-4-job-application`  
> Parent branch: `main`  
> Status: Completed  

---

## 🎯 Objective

Introduce the Job Application module and establish relational integrity between:

- Candidate
- Job
- Application

This phase enables candidates to apply for jobs, ensures duplicate prevention at both service and database levels, and lays the foundation for application lifecycle management.

---

## 📦 Scope

### ✅ Included

### 1️⃣ Application Entity Design

- `applications` table introduced
- UUID primary key
- Explicit FK columns:
  - `candidateId`
  - `jobPostingId`
- Proper `ManyToOne` relations:
  - Application → Candidate
  - Application → Job
- Composite unique constraint:

  ```typescript
  (jobPostingId, candidateId)
  ```

- Enum-based status
- Default status: `APPLIED`
- Audit timestamps (`createdAt`, `updatedAt`)

---

### 2️⃣ Repository Layer

Custom repository abstraction implemented.

Methods:

- `create()`
- `save()`
- `findByCandidateAndJob()`
- `findByCandidate()`

Features:

- Duplicate lookup support
- FK-based querying
- Optional relational loading for job metadata

---

### 3️⃣ DTO & Response Contracts

#### Request DTO

`create-application.dto.ts`

- Strict Zod validation
- UUID validation
- No client-controlled status
- No client-provided candidateId

#### Response Contract

`application.response.ts`

- Controlled response shape
- No internal entity leakage
- Stable API boundary

---

### 4️⃣ Service Layer (ApplicationService)

Implemented:

#### applyForJob()

- Job existence validation (404)
- Duplicate application prevention (409)
- Application creation
- Atomic increment of `applicantCount`
- FK-based persistence

#### getAllApplicationsByCandidate()

- Candidate-scoped retrieval
- No cross-user data exposure
- Returns empty array when none exist

Business rules enforced:

- One application per candidate per job
- Status initialized internally
- Candidate identity derived from JWT

---

### 5️⃣ Controller Layer

Endpoints added:

```code
POST /api/v1/applications/apply
GET /api/v1/applications/me
```

Features:

- JWT-protected
- Role-restricted (candidate only)
- Zod validation
- Proper HTTP status handling
- Error propagation to global handler

---

### 6️⃣ Route Registration

- `application.routes.ts` created
- Mounted under:

  ```code
  /api/v1/applications
  ```

Integrated into central route registry.

---

### 7️⃣ Manual API Verification (Postman)

Validated:

#### Apply API

- Successful apply → 201
- Duplicate apply → 409
- Invalid job → 404
- Missing JWT → 401
- Wrong role → 403
- Invalid UUID → 400
- Wrong content-type → 415

#### Get Applications

- Returns correct candidate data
- No data leakage
- Correct response structure
- Handles empty state

---

## ❌ Explicitly Excluded

- Recruiter status updates (moved to later phase)
- Withdraw application endpoint
- Application deletion
- Dashboard aggregation
- Automated test coverage for applications
- Performance optimization

---

## 🧱 Architecture Decisions

- Explicit FK columns for clean querying
- Composite uniqueness enforced at DB level
- Service-level duplicate validation
- Atomic counter updates using `increment()`
- DTO boundary separates entity from API
- No status mutation allowed during creation
- Strict role-based access enforcement

---

## 🗂 Files Added / Modified

### New

- `application.entity.ts`
- `application.repository.ts`
- `application.service.ts`
- `application.controller.ts`
- `application.routes.ts`
- `create-application.dto.ts`
- `application.response.ts`

### Modified

- Route registry
- Job repository (for atomic increment usage)
- Response contracts alignment

---

## 🧪 Testing Performed

Manual testing via Postman.

Validated:

- Duplicate prevention
- FK integrity
- Atomic applicant count updates
- Proper status defaults
- Correct error codes
- Role enforcement
- JWT enforcement
- Response contract consistency

---

## ⚠️ Known Limitations / Deferred Work

- No recruiter-side status transitions yet
- No withdraw endpoint
- No integration test coverage
- No dashboard aggregation support
- No performance tuning for high concurrency

These are deferred to subsequent phases.

---

## 🧠 Key Learnings

- Composite unique constraints prevent race-condition duplicates.
- Atomic DB increment avoids counter inconsistencies.
- Explicit FK columns simplify repository queries.
- DTO strictness prevents client-side state injection.
- Clear phase boundaries prevent scope creep.
- Application lifecycle should be separated from dashboard aggregation.

---

## ✅ Phase Completion Criteria (Met)

- Application entity correctly modeled
- Composite uniqueness enforced
- Candidate can apply once per job
- Duplicate prevention works
- Applicant count increments atomically
- Applications retrievable per candidate
- Routes integrated
- Manual verification completed
- Phase merged into `main`

---

> This document reflects the system state at the end of Phase 4 and remains frozen after merge.
