# Phase 3.1 – Job Management

> Branch: `backend-phase-3.1-job-management`
> Parent branch: `main`
> Status: In Progress

---

## 🎯 Objective

Extend the recruiter job module to support full lifecycle management of job postings.

This phase introduces:

- Job update capability
- Job deletion (hard delete)
- Controlled status transitions
- Strong ownership enforcement

The goal is to move from "job creation" to complete job management.

---

## 📦 Scope

### ✅ Included

#### 1. Update Job

- Recruiter can update:
  - title
  - description
  - minimum qualification
  - job sector
  - vacancies
  - status (OPEN ↔ CLOSED)

- Partial updates allowed (PATCH)
- Ownership enforced via `recruiterId`
- Only `RECRUITER` role allowed

---

#### 2. Change Job Status

- Recruiter can manually:
  - Close job (OPEN → CLOSED)
  - Reopen job (CLOSED → OPEN)

- Status transitions are controlled
- No automatic closure logic
- Recruiter owns lifecycle decisions

---

#### 3. Delete Job (Hard Delete)

- Recruiter can delete only their own jobs
- Hard delete chosen over soft delete

##### Rationale for Hard Delete

- Jobs are recruiter-controlled resources
- `status = CLOSED` already covers lifecycle pause
- No business requirement for historical retention
- Avoids schema complexity (`isActive`, filters, etc.)

---

### ❌ Explicitly Excluded

- Application logic
- Applicant management
- Automated status transitions
- Analytics/statistics
- Audit logs

---

## 🧱 Architecture Decisions

- Ownership enforced in the service layer
- Role enforcement at the route layer via middleware
- Controllers remain thin
- DTOs exclude identity fields (`recruiterId`)
- Updates use PATCH semantics
- Hard delete implemented at repository level
- No cascading deletes beyond job entity
- `applicantCount` represents number of applications received
- `applicantCount` may exceed `vacancies`
- Status is manually controlled by recruiter

---

## 🗂 Files Added / Modified

### Job Module

- job.dto.ts (update schema added)
- job.service.ts (update + delete logic)
- job.controller.ts (update + delete endpoints)
- job.routes.ts (PATCH and DELETE routes)

---

## 🧪 Testing Performed

Manual testing via Postman.

Verified:

- Update only own job
- Cannot update another recruiter’s job
- Delete only own job
- Cannot delete another recruiter’s job
- Status change works
- Partial update works
- Validation errors handled correctly
- 404 on invalid job ID
- 403 on ownership violation

---

## ⚠️ Known Limitations / Deferred Work

- No audit logging
- No historical job retention
- No automated closing based on application count
- No concurrency handling
- No automated test coverage

These are deferred to Phase 3.2 – Testing & Hardening.

---

## 🧠 Key Learnings

- Ownership enforcement should be applied at query level wherever possible.
- Hard delete simplifies lifecycle management.
- Status-based lifecycle control is sufficient without soft delete.
- PATCH semantics reduce validation complexity.
- Clear aggregate boundaries reduce accidental coupling.

---

## ✅ Phase Completion Criteria

- Recruiter can update job
- Recruiter can delete job
- Ownership enforced
- Status transitions validated
- Manual API testing completed
- Documentation finalized
- Changes merged into `main`

---

> This document reflects the system state at the end of Phase 3.1 and remains frozen after merge.
