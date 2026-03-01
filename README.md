# Phase 5 – Dashboards (Aggregation APIs)

> Branch: `backend-phase-5-dashboards`  
> Parent branch: `main`  
> Status: Completed  

---

## 🎯 Objective

Introduce read-only aggregation APIs for Recruiter and Candidate dashboards.

This phase enables:

- Recruiters to view aggregated job and application metrics  
- Recruiters to view per-job applicant breakdown with pagination  
- Candidates to view application summary metrics  
- Candidates to view paginated applied jobs listing  
- Strict ownership enforcement  
- Deterministic pagination  
- Clean response mapping  

No new entities were introduced in this phase.

All APIs are read-only.

---

## 📦 Scope

---

## 🧑‍💼 Recruiter Dashboard

---

### 1️⃣ Recruiter – Dashboard Overview

Endpoint:

```code
GET /api/v1/recruiter/dashboard/overview
```

Features:

- Recruiter-only access  
- Aggregated job metrics:
  - Total jobs
  - Open jobs
  - Closed jobs  
- Aggregated application metrics:
  - Total applications
  - Status breakdown (APPLIED, SHORTLISTED, REJECTED)  
- Parallel aggregation queries using `Promise.all()`  
- PostgreSQL `FILTER` aggregation  
- No N+1 queries  
- No relation over-fetching  
- Clean response mapping  
- Deterministic numeric normalization  

Response Shape:

```typescript
{
  jobs: {
    total,
    open,
    closed
  },
  applications: {
    total,
    byStatus: {
      APPLIED,
      SHORTLISTED,
      REJECTED
    }
  }
}
```

---

### 2️⃣ Recruiter – Job-Level Dashboard (Paginated)

Endpoint:

```code
GET /api/v1/recruiter/dashboard?page=1&limit=10
```

Features:

- Recruiter-only access  
- Returns per-job aggregation:
  - jobId
  - title
  - status
  - applicantCount
  - applied
  - shortlisted
  - rejected  
- Uses `LEFT JOIN` to include jobs with zero applications  
- Uses `GROUP BY` for aggregation  
- Uses `COUNT(application.id)` (not `COUNT(*)`)  
- Deterministic ordering (`createdAt DESC`)  
- SQL-level pagination using `.limit()` and `.offset()`  
- Separate total job count via `repository.count()`  
- Stable meta structure  

Response Shape:

```typescript
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

Important implementation detail:

- For `getRawMany()` queries, `.limit()` and `.offset()` were used instead of `.skip()` and `.take()` to ensure proper SQL pagination behavior.

---

## 🎓 Candidate Dashboard

---

### 3️⃣ Candidate – Dashboard Summary

Endpoint:

```code
GET /api/v1/candidate/dashboard
```

Features:

- Candidate-only access  
- Aggregated application metrics:
  - Total applications
  - Status breakdown  
- No joins required  
- Single-row aggregation  
- PostgreSQL `FILTER` usage  
- Clean numeric normalization  

Response Shape:

```typescript
{
  totalApplications,
  byStatus: {
    APPLIED,
    SHORTLISTED,
    REJECTED
  }
}
```

---

### 4️⃣ Candidate – Applied Jobs Listing (Paginated)

Endpoint:

```code
GET /api/v1/candidate/dashboard/applications?page=1&limit=10
```

Features:

- Candidate-only access  
- Returns applied jobs with:
  - jobId
  - title
  - status
  - appliedAt (ISO normalized)  
- `INNER JOIN` to job entity  
- Deterministic ordering (`createdAt DESC`)  
- SQL-level pagination using `.limit()` and `.offset()`  
- Separate total count using `repository.count()`  
- ISO date normalization in response mapper  

Response Shape:

```typescript
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

## 📘 DTO Validation (Zod v4)

Query DTO:

```typescript
page: z.coerce.number().int().min(1).default(1)
limit: z.coerce.number().int().min(1).max(50).default(10)
```

Key decisions:

- Query params coerced from string → number  
- Page minimum enforced (≥ 1)  
- Limit capped (≤ 50)  
- Defaults handled at schema level  
- `.strict()` applied  

---

## ❌ Explicitly Excluded

- Any lifecycle mutation logic  
- Any new entities  
- Analytics caching  
- Cross-role data aggregation  
- Public job browsing  
- Performance indexing optimization  
- Test suite expansion  

---

## 🧱 Architecture Decisions

- Aggregation performed at DB level (no JS loops)  
- No N+1 queries introduced  
- SQL `FILTER` used for conditional counts  
- `GROUP BY` required for per-job aggregation  
- `.limit()` / `.offset()` used for raw query pagination  
- Total count queries separated from grouped queries  
- Mapping remains in controller layer (consistent with project pattern)  
- Dates normalized to ISO format  
- Clean repository → service → controller layering preserved  
- No domain rules introduced in dashboard layer  

---

## 🗂 Files Added / Modified

### Recruiter Dashboard

- `recruiter-dashboard.repository.ts`
- `recruiter-dashboard.service.ts`
- `recruiter-dashboard.controller.ts`
- `recruiter-dashboard.routes.ts`
- `query-dashboard.dto.ts`
- `recruiter-dashboard.response.ts`

### Candidate Dashboard

- `candidate-dashboard.repository.ts`
- `candidate-dashboard.service.ts`
- `candidate-dashboard.controller.ts`
- `candidate-dashboard.routes.ts`
- `query-dashboard.dto.ts`
- `candidate-dashboard.response.ts`

---

## 🧪 Manual Verification

Validated via Postman:

- Recruiter dashboard overview aggregation correctness  
- Recruiter job-level pagination behavior  
- SQL-level limit/offset correctness  
- Candidate dashboard summary aggregation  
- Candidate applied jobs pagination  
- Meta correctness (total, page, limit, totalPages)  
- ISO date normalization  
- JWT enforcement  
- Role enforcement  
- 404 isolation across roles  

---

## 🧠 Key Learnings

- SQL `FILTER` simplifies conditional aggregation  
- `GROUP BY` requires grouping all selected non-aggregated columns  
- `COUNT(column)` safer than `COUNT(*)` in joins  
- `getRawMany()` requires `.limit()` / `.offset()` for reliable pagination  
- `repository.count()` is sufficient for simple totals  
- Always normalize date outputs  
- Parallel queries via `Promise.all()` improve performance  
- Pagination math belongs in service layer  
- Mapping consistency across modules reduces cognitive load  

---

## ✅ Phase Completion Criteria

- Recruiter dashboard overview implemented  
- Recruiter job-level aggregation with pagination implemented  
- Candidate dashboard summary implemented  
- Candidate applied jobs listing with pagination implemented  
- Ownership strictly enforced  
- No cross-tenant data leakage  
- Deterministic pagination meta  
- Clean layering preserved  
- No new entities introduced  
- Manual verification completed  
- Phase merged into `main`  

---

> This document reflects the system state at the end of Phase 5 and remains frozen after merge.
