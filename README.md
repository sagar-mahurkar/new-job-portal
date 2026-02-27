# Phase 4.1 – Application Management (Recruiter side)

> Branch: `backend-phase-4.1-application-management`  
> Parent branch: `main`  
> Status: Completed  

---

## 🎯 Objective

Extend the Job Application module to support recruiter-side lifecycle management.

This phase enables recruiters to:

- View applications for their job postings  
- Update application status  
- Enforce controlled lifecycle transitions  
- Maintain strict ownership validation  

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
- Ownership validation (job must belong to recruiter)  
- Pagination support  
- Optional status filtering  
- Candidate profile included (safe projection)  
- 404 for non-owned jobs  

---

### 2️⃣ Recruiter – Update Application Status

Endpoint:

```code
PATCH /api/v1/recruiter/applications/:id/status
```

Features:

- Recruiter-only access  
- Ownership validation  
- Strict enum validation (Zod)  
- Controlled status transitions  
- Idempotent updates  
- `statusUpdatedAt` auto-updated  
- 404 for cross-job access  

---

### 3️⃣ Application Lifecycle Rules

Status transitions allowed:

```code
APPLIED → SHORTLISTED  
APPLIED → REJECTED  
SHORTLISTED → REJECTED
```

Not allowed:

- Any backward transitions  
- REJECTED → any state  
- SHORTLISTED → APPLIED  

Transition logic centralized in:

```typescript
isValidTransition(from, to)
```

No transition logic in controller.

---

### 4️⃣ Entity Updates

Added:

```typescript
statusUpdatedAt: Date
```

Maintained:

- Composite unique constraint `(jobPostingId, candidateId)`  
- Explicit FK columns  
- Enum-based status  
- Audit timestamps  

---

### 5️⃣ Repository Layer

New/Extended Methods:

- `findByJobPosting(jobPostingId, filters)`  
- `findById(applicationId)`  

Features:

- Explicit FK querying  
- Controlled relational loading (`candidate`)  
- Pagination support  

---

### 6️⃣ Service Layer

Implemented:

#### listApplicationsByJob()

- Job ownership validation  
- Status filtering  
- Pagination logic  
- Safe candidate mapping  

#### updateApplicationStatus()

- Application lookup  
- Ownership validation  
- Transition guard enforcement  
- Status update  
- `statusUpdatedAt` update  

Business rules enforced:

- No cross-recruiter manipulation  
- No invalid transitions  
- No business logic in controller  

---

### 7️⃣ Response Contracts

- Controlled recruiter-safe candidate projection  
- No password leakage  
- No internal entity exposure  
- Stable response structure  

---

### 8️⃣ Manual API Verification (Postman)

Validated:

#### List Applications

- Success → 200  
- Non-owned job → 404  
- Invalid UUID → 400  
- Missing JWT → 401  
- Wrong role → 403  
- Status filter works  
- Pagination works  

#### Update Status

- Valid transition → 200  
- Invalid transition → 400  
- Non-owned application → 404  
- Invalid enum → 400  
- Missing JWT → 401  
- Wrong role → 403  

---

## ❌ Explicitly Excluded

- Candidate withdraw endpoint  
- Application deletion  
- Recruiter dashboard aggregation  
- Notification system  
- Optimistic locking  
- Automated test coverage expansion beyond scope  

---

## 🧱 Architecture Decisions

- Lifecycle rules centralized in domain guard  
- Ownership validation strictly in service layer  
- 404 returned for unauthorized access (no data leakage)  
- Explicit FK querying preserved  
- Composite uniqueness untouched  
- No controller-level business logic  
- Clean entity → DTO → repository → service → controller layering maintained  

---

## 🗂 Files Added / Modified

### New

- `update-application-status.dto.ts`  
- Transition guard utility  

### Modified

- `application.entity.ts`  
- `application.repository.ts`  
- `application.service.ts`  
- `application.controller.ts`  
- `application.routes.ts`  
- Response mappers  

---

## 🧪 Testing Performed

Manual testing via Postman.

Validated:

- Ownership enforcement  
- Transition validation  
- Enum strictness  
- Data leakage prevention  
- Correct HTTP codes  
- Candidate relation loading  
- Pagination & filtering behavior  

---

## ⚠️ Known Limitations / Deferred Work

- No withdraw application endpoint  
- No dashboard analytics  
- No optimistic locking  
- No event-driven notifications  
- No high-concurrency stress testing  

Deferred to future phases.

---

## 🧠 Key Learnings

- Centralized transition guards simplify lifecycle control.  
- Ownership validation must precede all mutations.  
- Returning 404 prevents cross-tenant information leakage.  
- Strict enum validation prevents state corruption.  
- Clean layering prevents controller logic creep.  

---

## ✅ Phase Completion Criteria

- Recruiter can list applications for own jobs  
- Recruiter can update application status  
- Transition rules enforced  
- Ownership strictly validated  
- No sensitive data leakage  
- Routes integrated  
- Manual verification completed  
- Phase merged into `main`  

---

> This document reflects the system state at the end of Phase 4.1 and remains frozen after merge.
