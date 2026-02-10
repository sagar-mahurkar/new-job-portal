# Phase 2.1 – User Profile Management

> Branch: `backend-phase-2.1-profile-management`  
> Status: Inprogress  
> Parent branch: `main`

---

## 🎯 Objective

- Allow users to update and manage profile data

- Ensure only the owner can modify their profile

- Keep profile logic separate from auth and jobs

---

## 📦 Scope

### Included

#### 1. Update Candidate Profile

- Update candidate-specific fields (e.g., bio, skills, experience, etc.)

- Profile identified via req.user.id

- Role must be candidate

#### 2. Update Recruiter Profile

- Update recruiter-specific fields:

  - company name

  - sector

  - description

- Profile identified via req.user.id

- Role must be recruiter

### Explicitly Excluded

- Feature A
- Feature B (planned for later phase)

---

## 🧱 Architecture Decisions

Document *why* certain decisions were made.

- Ownership enforced at service layer
- Role-based access enforced via middleware
- DTO validation handled using Zod
- Global error handling used instead of try/catch in controllers

---

## 🗂 Files Added / Modified

High-level list only (no code snippets):

- `src/modules/job/job.entity.ts`
- `src/modules/job/job.service.ts`
- `src/middlewares/error.middleware.ts`

---

## 🧪 Testing Performed

- Manual API testing via Postman
- Verified role-based access (recruiter vs candidate)
- Verified ownership enforcement
- Verified error handling behavior

---

## ⚠️ Known Limitations / Deferred Work

- Update/Delete job APIs (Phase 3.1)
- Unit tests (Phase 3.2)
- Advanced DB error mapping

---

## 🧠 Key Learnings

Optional but recommended.

- Importance of FK type alignment (uuid vs string)
- Importance of global error handling
- Keeping controllers thin

---

## ✅ Phase Completion Criteria

- Core APIs functional
- Authorization enforced
- Feature tested end-to-end

---

> This document reflects the state of the project **at the end of this phase** and is intentionally not updated further.
