# Phase 4.1 – Application Management (Recruiter Side)

> Branch: `backend-phase-4.1-application-management`  
> Parent branch: `main`  
> Status: Completed  

---

## 🎯 Objective

Extend the Job Application module to support recruiter-side lifecycle management with strict domain separation and paginated querying.

This phase enables recruiters to:

- View applications for their own job postings  
- Update application status  
- Enforce controlled lifecycle transitions  
- Maintain strict ownership validation  
- Support paginated responses with metadata  

---

## 📦 Scope

### ✅ Included

---

### 1️⃣ Recruiter – List Applications

Endpoint:

```code
GET /api/v1/recruiter/jobs/:jobId/applications
```

Features:

- Recruiter-only access  
- Ownership validation (job must belong to authenticated recruiter)  
- Pagination using `findAndCount()`  
- Safe default pagination (page ≥ 1, capped pageSize)  
- Optional status filtering (if provided)  
- Candidate profile included (sanitized projection)  
- 404 for non-owned jobs (prevents cross-tenant leakage)  
- Stable meta response structure  

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

### 2️⃣ Recruiter – Update Application Status

Endpoint:

```code
PATCH /api/v1/recruiter/applications/:id/status
```

Features:

- Recruiter-only access  
- Ownership validation (application’s job must belong to recruiter)  
- Strict enum validation (Zod v4)  
- Controlled lifecycle transitions  
- Idempotent-safe updates  
- `updatedAt` auto-managed via `@UpdateDateColumn`  
- 404 for cross-job access  

---

### 3️⃣ Application Lifecycle Rules (Domain Guard)

Lifecycle logic moved to application domain.

File:

```code
application.lifecycle.ts
```

Transition matrix implemented using:

```code
Record<ApplicationStatus, Set<ApplicationStatus>>
```

Allowed transitions:

```code
APPLIED → SHORTLISTED  
APPLIED → REJECTED  
SHORTLISTED → REJECTED
```

Not allowed:

- Backward transitions  
- REJECTED → any state  
- SHORTLISTED → APPLIED  

Validation function:

```typescript
isValidTransition(from, to)
```

Rules:

- If `from === to` → return true (idempotent safe)
- Otherwise check transition matrix
- Pure function
- No DB access
- No service imports

Lifecycle rules remain inside **application module**, not recruiter module.

---

### 4️⃣ Entity & Enum Alignment

Application entity:

- Enum column using union type
- Composite unique constraint `(jobPostingId, candidateId)`
- Explicit FK columns
- Audit timestamps

Important learning:

Postgres enums require migration when values change.  
Dropping table alone does not always remove enum type.

Correct fix:

```code
ALTER TYPE applications_status_enum ADD VALUE 'SHORTLISTED';
```

or drop enum explicitly during development.

---

### 5️⃣ Repository Layer

#### Job Repository

- `findIdsByRecruiterId(recruiterId)`
- Returns only job IDs using `select: { id: true }`

#### Application Repository

- `findByJobPosting(jobPostingId, page, limit)`
- Uses `findAndCount()`
- Supports pagination
- Loads required relations (`candidate`)
- Ordered by `createdAt DESC`

Repository methods reflect data access intent, not business intent.

---

### 6️⃣ Service Layer

#### listApplicationsByJob()

- Validate job exists
- Validate recruiter ownership
- Apply pagination defaults
- Fetch via repository
- Return `{ data, meta }`

#### updateApplicationStatus()

- Fetch application
- Validate recruiter ownership
- Call `isValidTransition()`
- Update status
- Persist via repository

Service orchestrates only.  
No lifecycle logic inside recruiter service.

---

### 7️⃣ Response Mapping

Separate role-based mappers:

- `mapApplicationToCandidateResponse`
- `mapApplicationToRecruiterResponse`

Important rule:

Service must hydrate required relations before mapping.

Bug fixed:
`repo.save()` does not auto-load relations.  
Relations must be attached or re-queried before returning.

---

### 8️⃣ DTO Validation (Zod v4)

Query DTO:

- `jobId: z.uuid()`
- `pageSize: z.coerce.number().int().min(1).max(50).optional()`
- `pageNumber: z.coerce.number().int().min(1).optional()`

Key points:

- Query params are strings → use `coerce`
- Page cannot be 0
- Page size capped to prevent abuse
- `.strict()` applied

---

## ❌ Explicitly Excluded

- Candidate withdraw endpoint  
- Application deletion  
- Recruiter dashboard aggregation  
- Notification system  
- Optimistic locking  
- Automated test coverage expansion  

---

## 🧱 Architecture Decisions

- Lifecycle rules centralized in application domain  
- Recruiter module handles authorization, not domain rules  
- 404 returned for unauthorized ownership access  
- Explicit FK querying preserved  
- Pagination implemented at repository level  
- No controller-level business logic  
- No service-to-service imports  
- Clean entity → DTO → repository → service → controller layering maintained  

---

## 🗂 Files Added / Modified

### New

- `application.lifecycle.ts`
- `update-application-status.dto.ts`

### Modified

- `application.repository.ts`
- `application.service.ts`
- `application.controller.ts`
- `job.repository.ts`
- `recruiter.service.ts`
- `recruiter.controller.ts`
- Response mappers

---

## 🧪 Testing Performed

Manual verification via Postman.

Validated:

- Recruiter ownership enforcement  
- Transition matrix validation  
- Enum strictness  
- Pagination meta correctness  
- Relation hydration  
- 404 for cross-tenant access  
- Proper HTTP codes  
- Malformed UUID → 400  
- JWT + role enforcement  

---

## 🧠 Key Learnings

- Domain rules must not live in orchestration services  
- Transition matrix is cleaner than conditional chains  
- `findAndCount()` required for proper pagination  
- Postgres enum changes require migration  
- `repo.save()` does not hydrate relations  
- Returning 404 prevents information leakage  
- Repository methods must reflect data access, not business intent  
- Union types provide enum safety without TypeScript enums  

---

## ✅ Phase Completion Criteria

- Recruiter can list applications for owned jobs  
- Pagination implemented with meta  
- Recruiter can update application status  
- Transition guard enforced  
- Ownership strictly validated  
- No data leakage  
- Clean layering preserved  
- Manual verification completed  
- Phase merged into `main`  

---

> This document reflects the system state at the end of Phase 4.1 and remains frozen after merge.
