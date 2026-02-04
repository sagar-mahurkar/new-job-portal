# PHASE-WISE DEVELOPMENT PLAN

## Phase 1: Auth + Base User (HIGHEST PRIORITY)

🎯 Why first?

Everything depends on:

- user identity

- role (recruiter / candidate)

- authentication

If this is wrong → everything breaks later.

### Step 1: User module (FOUNDATION ENTITY)

Target:

- user.entity.ts

- user.repository.ts

User Fields:

- id
- name
- email (unique, normalized)
- password? (hashed)
- role (enum)
- isActive
- loginOtp
- loginOtpExpiresAt
- emailVerificationOtp (later)
- createdAt
- updatedAt

Relations:

- recruiter (1-1)
- candidate (1-1)

Repository:

- create and export `RepoName` using `DataSourseName.getRepository(Entity)`

🚫 No controller yet

🚫 No routes yet
