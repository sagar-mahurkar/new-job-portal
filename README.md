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

---

## 🧱 Architecture Overview

- Layered architecture:
  Entity → DTO → Repository → Service → Controller → Routes
- Authentication via JWT (OTP + password)
- Role-based authorization via middleware
- Ownership enforcement handled at service layer
- Centralized error handling
- Response mapping to prevent sensitive data leakage
- Database access via TypeORM

---

## 📦 Implemented Phases

- Phase 0 – Foundation
- Phase 1 – Authentication
- Phase 2 – Authorization & Middleware
- Phase 2.1 – Profile Management
- Phase 3 – Job Posting (Recruiter)
- Phase 3.1 – Job Management (Update/Delete)

> Phase-specific implementation details are documented in their respective phase branches.

---

## 📌 Current Capabilities

### 👤 User (Shared)

- Sign up & authenticate via OTP or password
- Fetch own profile (`/me`)
- Update profile details
- Soft delete (deactivate account)

---

### 🧑‍💼 Recruiter

- Create job postings
- View own job postings
- Fetch job details with ownership enforcement
- Update job (partial updates supported)
- Change job status (OPEN ↔ CLOSED)
- Delete job (hard delete)

---

### 🎓 Candidate

- Sign up & authenticate via OTP or password
- Fetch own profile
- Update candidate-specific profile details

---

## 🧪 Testing

- APIs tested manually using Postman
- Role-based access verified
- Ownership enforcement verified
- Validation errors handled via Zod
- Database constraint errors handled
- No regression observed after Phase 3.1

---

## 🏗️ Upcoming Work

- Phase 3.2 – Testing & Hardening
- Public job browsing (candidate-facing)
- Phase 4 – Job Applications
- Automated test coverage
- Performance and security improvements

---

## ▶️ Running Locally

Configure environment variables in `environments/.env.staging`.

```bash
npm install
npm run dev
