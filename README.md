# PHASE-WISE DEVELOPMENT PLAN

## Phase 3: Job Posting (Recruiter side)

🎯 Build your FIRST real feature

Build order (VERY IMPORTANT)

- job.entity.ts

- job.dto.ts

- job.repository.ts

- job.service.ts

- job.controller.ts

- job.routes.ts

Recruiter only.

Rules:

- Service checks ownership

- Repository never checks role

- Controller never checks DB

APIs

- create job

- list my jobs

- get job by id

---

### 🧱 Job Module (Core Feature)

#### New files added

```bash
src/modules/job/job.entity.ts
src/modules/job/dtos/
  ├─ create-job.dto.ts
  ├─ get-my-jobs.dto.ts
  └─ get-job-by-id.dto.ts
src/modules/job/job.repository.ts
src/modules/job/job.service.ts
src/modules/job/job.controller.ts
src/modules/job/job.routes.ts
```

These together form the complete vertical slice of the Job Posting feature.

#### Recruiter Module (Fixes / Alignment)

Modified

```bash
src/modules/recruiter/recruiter.entity.ts
```

Changes made

- Fixed `@OneToMany` type → `Job[]`

- Explicitly typed `userId` as `uuid`

- Ensured FK alignment with `Job.recruiterId`

#### Auth & Authorization (Cross-Phase, finalized in Phase 3)

Modified

```bash
src/modules/auth/auth.types.ts
src/middlewares/auth.middleware.ts
src/middlewares/role.middleware.ts
```

Purpose:

- Single source of truth for `AuthenticatedUser`

- Used by Express request typing

Changes:

- `recruiter` is not same as `RECRUITER`

- JWT payload → `req.user`

- Role checks moved to enum-based (`UserRole`)

- Removed raw string role comparisons

#### Global Type Augmentation (Critical)

Deleted old file

```bash
src/types/express.d.ts
```

Added

```bash
src/@types/express/index.d.ts
```

Purpose:

- Augments Express.Request with user

- Enables safe req.user.id usage everywhere

#### Error Handling (JPFS-49)

Modified

```bash
src/middlewares/error.middleware.ts
```

Enhancements:

- Added ZodError handling

- Added QueryFailedError handling

- Preserved logger

- Unified API error response format

#### Common / Shared

```bash
src/common/enums/*
```

Changes:

- Introduced / normalized:

  - UserRole

  - Job-related enums (status, sector, qualification)

- Ensured enum consistency across:

  - JWT

  - middleware

  - entities

  - DTOs

#### Configuration (Hard Requirement)

Modified

```bash
tsconfig.json
```

Changes:

- Added typeRoots for Express augmentation

- Fixed include placement

- Enabled proper TS discovery for .d.ts files

#### Database (Schema-Level Impact)

> No migration files yet (using `synchronize: true`)

Schema effects caused by entity changes

- `jobs` table created

- `recruiters` FK alignment fixed

- UUID FK correctness enforced

---

### Overview

Implemented recruiter-side job posting functionality with secure, role-based access control and ownership enforcement.

### Key Capabilities

- Recruiter can create job postings

- Recruiter can list their own jobs

- Recruiter can fetch job details by ID

- Ownership enforced at service layer

- Role-based access enforced via middleware

### Architecture

- Clean layering: Entity → DTO → Repository → Service → Controller → Routes

- Authentication via JWT

- Authorization via role guards

- Global error handling for validation, domain, and database errors

### Status

- Phase complete

- Core flows tested via Postman

- Error handling normalized

- Enhancements tracked separately
