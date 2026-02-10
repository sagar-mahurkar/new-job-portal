# Job Portal Backend

Backend service for a job portal supporting recruiters and candidates, built with clean architecture and phased development.

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
- Authentication via JWT
- Role-based authorization via middleware
- Centralized error handling
- Database access via TypeORM

---

## 📦 Implemented Phases

- Phase 0 – Foundation
- Phase 1 – Authentication
- Phase 2 – Authorization & Middleware
- Phase 3 – Job Posting (Recruiter)

> Phase-specific implementation details are documented in their respective phase branches.

---

## 📌 Current Capabilities

### Recruiter

- Sign up & authenticate
- Create job postings
- View own job postings
- Fetch job details with ownership enforcement

### Candidate

- Sign up & authenticate

---

## 🧪 Testing

- APIs tested manually using Postman
- Role and ownership validation verified
- Error handling validated for validation and DB failures

---

## 🏗️ Upcoming Work

- Phase 2.1 – Profile Management
- Phase 3.1 – Job Update/Delete
- Phase 3.2 – Testing & Hardening
- Phase 4 – Job Applications

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```
