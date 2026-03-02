# Phase 6 – Public APIs (Job Browsing)

> Branch: `backend-phase-6-public-apis`  
> Parent branch: `main`  
> Status: Completed  

---

## 🎯 Objective

Expose public, read-only job browsing APIs for candidates and unauthenticated users.

This phase enables:

- Public job listing with pagination  
- Public job search and filtering  
- Public job details view  
- Public filter metadata endpoint  
- Strict exposure control (OPEN jobs only)  
- Deterministic ordering  
- No recruiter-private data leakage  

No new entities were introduced.

All APIs are read-only and require **no JWT**.

---

## 📦 Scope

---

## 🌍 Public Job Listing

### 1️⃣ Public – Job Listing (Paginated)

Endpoint:

```code
GET /api/v1/jobs?page=1&limit=10&search=&sector=&location=&experienceLevel=
```

Features:

- Public access (no authentication)
- Only `status = OPEN` jobs returned
- Optional filters:
  - search (title + description, ILIKE)
  - sector
  - location
  - experienceLevel
- Deterministic ordering (`createdAt DESC`)
- SQL-level pagination using `.limit()` and `.offset()`
- Separate total count query
- Explicit column projection (no `select *`)
- `LEFT JOIN` to recruiter to expose `companyName`
- Raw query mode with explicit aliases
- Response mapping to prevent entity leakage

Response Shape:

```typescript
{
  data: [
    {
      jobId,
      title,
      description,
      sector,
      minQualification,
      location,
      experienceLevel,
      companyName,
      postedOn
    }
  ],
  meta: {
    total,
    page,
    limit,
    totalPages
  }
}
```

---

## 🔎 Public Job Details

### 2️⃣ Public – Job Details

Endpoint:

```code
GET /api/v1/jobs/:id
```

Features:

- Public access (no authentication)
- Returns full job details
- Only returns job if `status = OPEN`
- Returns 404 if:
  - Job not found
  - Job is CLOSED
- Uses raw query mode with explicit aliases
- Joins recruiter to expose `companyName`
- Clean response mapping
- No recruiter-private fields exposed

Response Shape:

```typescript
{
  jobId,
  title,
  description,
  sector,
  minQualification,
  location,
  experienceLevel,
  companyName,
  postedOn
}
```

---

## 🧩 Public Job Filters

### 3️⃣ Public – Job Filters Metadata

Endpoint:

```code
GET /api/v1/jobs/filters
```

Purpose:

Provide metadata required for frontend filtering.

Features:

- Public access (no authentication)
- Derived only from `OPEN` jobs
- Uses `SELECT DISTINCT`
- No pagination
- No joins required
- Parallel queries via `Promise.all()`
- Flattened raw results into string arrays

Response Shape:

```typescript
{
  locations: string[],
  experienceLevels: string[]
}
```

---

## 📘 DTO Validation (Zod v4)

Listing Query DTO:

```typescript
search: z.string().min(1).optional()
sector: z.enum(COMPANY_SECTORS).optional()
location: z.string().min(1).optional()
experienceLevel: z.enum(EXPERIENCE_LEVELS).optional()
page: z.coerce.number().int().min(1).default(1)
limit: z.coerce.number().int().min(1).max(50).default(10)
```

Details Param DTO:

```typescript
id: z.uuid()
```

Key decisions:

- Query params coerced from string → number
- Defaults handled at schema level
- `.strict()` enforced
- UUID validated at DTO level
- No controller-level manual parsing

---

## 🔒 Security & Exposure Rules

- No JWT required
- Only `status = OPEN` enforced at query level
- No recruiterId exposed
- No applicantCount exposed
- No internal lifecycle data exposed
- Explicit column selection (no implicit entity serialization)
- Static route `/jobs/filters` declared before `/jobs/:id`
- Proper 404 handling for non-visible jobs

---

## 🧱 Architecture Decisions

- Raw query mode used for projection safety
- Explicit column aliasing to avoid hydration issues
- Deterministic ordering before pagination
- Separate total count queries
- No entity hydration for public APIs
- Repository → Service → Controller layering preserved
- Mapping handled via dedicated response mapper
- No mutation logic introduced
- Domain model extended with:
  - `location`
  - `experienceLevel`

---

## 🗂 Files Added / Modified

### Public Job Module

- `public-job.repository.ts`
- `public-job.service.ts`
- `public-job.controller.ts`
- `public-job.routes.ts`
- `public-job.response.ts`
- `dtos/list-public-jobs.dto.ts`
- `dtos/job-id-param.dto.ts`

### Job Domain Updates

- Added `location` column
- Added `experienceLevel` column
- Updated `create-job.dto.ts`
- Updated job creation service logic

---

## 🧪 Manual Verification

Validated via Postman:

- Public listing pagination correctness
- Deterministic ordering validation
- Search filter behavior (ILIKE)
- Sector/location/experienceLevel filtering
- JOIN correctness for `companyName`
- Raw alias mapping correctness
- 404 for CLOSED jobs
- 404 for non-existent jobs
- `/jobs/filters` route precedence correctness
- UUID validation behavior
- No JWT required
- No recruiter/private data leakage

---

## 🧠 Key Learnings

- `getOne()` fails with aliased raw selects — use `getRawOne()`
- Raw queries require explicit aliasing to avoid undefined fields
- Express route order matters (`/filters` before `/:id`)
- `.limit()` / `.offset()` preferred for raw query pagination
- Always enforce domain visibility (`status = OPEN`) at query layer
- Never rely on entity serialization for public APIs
- Mapping layer prevents accidental field exposure
- DTO defaults remove pagination boilerplate
- Projection safety is critical for public endpoints

---

## ❌ Explicitly Excluded

- Any job mutation logic
- Any application mutation logic
- Recruiter-only fields
- Analytics caching
- Performance indexing
- Test suite expansion
- Search optimization (beyond basic ILIKE)
- Sorting customization
- Full-text search integration

---

## ✅ Phase Completion Criteria

- Public job listing implemented
- Public job details implemented
- Public job filters endpoint implemented
- Only OPEN jobs visible
- Deterministic pagination implemented
- No sensitive recruiter data exposed
- Strict DTO validation enforced
- Route order conflict resolved
- Clean layering preserved
- No new entities introduced
- Manual verification completed
- Phase merged into `main`

---

> This document reflects the system state at the end of Phase 6 and remains frozen after merge.
