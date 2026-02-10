# Phase 2.1 – User Profile Management

> Branch: `backend-phase-2.1-profile-management`  
> Parent branch: `main`
> Status: Completed  

---

## 🎯 Objective

Introduce **self-service profile management** while maintaining strict ownership, role isolation, and clean architectural boundaries.

This phase focuses on enabling users to manage their own profile data without exposing identity-based access or leaking cross-role data.

---

## 📦 Scope

### ✅ Included

#### 1. Candidate Profile Management

- Fetch candidate profile via `/me`

- Update candidate-specific fields (experience, qualification, bio, links, etc.)

- Profile resolution via authenticated user (`req.user.id`)

- Access restricted to `CANDIDATE` role

#### 2. Recruiter Profile Management

- Fetch recruiter profile via /me

- Update recruiter-specific fields:

  - company name

  - company sector

  - company description

- Profile resolution via authenticated user (req.user.id)

- Access restricted to RECRUITER role

#### 3. User Profile Management (Shared)

- Fetch basic user details (name, email, role)

- Update user-level fields (name, email, password)

- Soft delete (deactivate user via isActive = false)

- Applicable to both candidates and recruiters

### Explicitly Excluded

- Automated tests (planned for Phase 3.2 – Testing & Hardening)

- Advanced profile validation rules

- Admin-level profile access

---

## 🧱 Architecture Decisions

- Profiles are **self-access only** (`/me` routes); no ID-based access.

- Role-based access is enforced at the **route layer** via middleware.

- Ownership is enforced at the **service layer**, not in controllers.

- User, Candidate, and Recruiter are treated as **separate aggregates**.

- Profile update operations use **PATCH**, not PUT.

- DTOs never include identity fields (`userId`, `role`).

- Responses are shaped via **explicit response mappers** to prevent data leakage.

- Soft delete is implemented at the **User level** using `isActive`.

- Services throw `AppError`; controllers only delegate and forward errors.

---

## 🗂 Files Added / Modified

### User Module

- `user.dto.ts`

- `user.service.ts`

- `user.controller.ts`

- `user.routes.ts`

- `user.response.ts`

### Candidate module

- `candidate.dto.ts`

- `candidate.service.ts`

- `candidate.controller.ts`

- `candidate.routes.ts`

- `candidate.response.ts`

### Recruiter module

- `recruiter.dto.ts`

- `recruiter.service.ts`

- `recruiter.controller.ts`

- `recruiter.routes.ts`

- `recruiter.response.ts`

---

## 🧪 Testing Performed

- Manual API testing using Postman

- Verified:

  - role-based access control

  - ownership enforcement

  - partial updates

  - soft delete behavior

  - validation errors (Zod)

  - response data hygiene (no sensitive fields leaked)

---

## ⚠️ Known Limitations / Deferred Work

- No automated test coverage yet

- Validation rules kept minimal

- Profile history/versioning not supported

These are intentionally deferred to a dedicated testing and hardening phase.

---

## 🧠 Key Learnings

- Clear aggregate boundaries significantly reduce code complexity.

- Designing `/me` routes early avoids future authorization bugs.

- Response mappers are essential for preventing accidental data exposure.

- Thin controllers + expressive services improve maintainability.

- Less code can still represent correct and complete behavior when architecture is sound.

---

## ✅ Phase Completion Criteria (Met)

- Candidate and recruiter profile APIs implemented

- User-level profile management supported

- Role and ownership enforcement verified

- APIs manually tested

- Phase documentation finalized

- Changes merged into `main`

---

> This document captures the design and implementation decisions as of the completion of Phase 2.1.\
The phase branch remains frozen for historical and review purposes.
