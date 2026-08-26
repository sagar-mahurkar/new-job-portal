# Job Portal

A full-stack job portal connecting candidates and recruiters through a role-based platform for job discovery, applications, recruitment management, and dashboards.

## Overview

The Job Portal provides separate experiences for:

- **Public users** — browse available jobs without authentication.
- **Candidates** — discover jobs, manage profiles, apply for jobs, and track applications.
- **Recruiters** — create and manage jobs, review applications, update application statuses, and monitor recruitment activity.

The application is built with a modular React frontend and a layered Node.js/Express backend.

## Features

### Authentication

- Candidate registration
- Recruiter registration
- Password-based login
- OTP-based authentication
- OTP verification
- JWT authentication
- Protected routes
- Role-based authorization
- Authentication state management
- Zod validation

### Public Job Browsing

- Browse open jobs
- Filter jobs
- View job details
- View recruiter/company information
- Pagination support

### Candidate

- Candidate dashboard
- Candidate profile management
- Resume URL management
- LinkedIn profile
- GitHub profile
- Portfolio URL
- Browse jobs
- Apply for jobs
- View submitted applications
- Track application status
- View application timestamps

### Recruiter

- Recruiter dashboard
- Recruiter profile management
- Create jobs
- View owned jobs
- Manage job status
- View applications for a job
- Update application status
- View recent applications
- Recruitment statistics

### UI & Application Infrastructure

- React Router
- Protected routes
- Role guards
- Authentication redirects
- Shared layouts
- Shared navigation
- Alert/notification system
- Bootstrap UI
- Bootstrap Icons
- Responsive interfaces
- Error page handling

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Bootstrap
- Bootstrap Icons
- Zod

### Backend

- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- Zod
- JWT
- bcrypt
- Nodemailer
- SendGrid

### Development

- Git
- GitHub
- npm
- ESLint
- TypeScript

## Project Structure

```text
job-portal/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── application/
│   │   │   ├── auth/
│   │   │   ├── candidate/
│   │   │   ├── candidate-dashboard/
│   │   │   ├── job/
│   │   │   ├── recruiter/
│   │   │   ├── recruiter-dashboard/
│   │   │   └── user/
│   │   ├── routes/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── config/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── candidate/
│   │   │   ├── job/
│   │   │   └── recruiter/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── shared/
│   ├── index.html
│   ├── package.json
│   └── tsconfig.app.json
│
└── README.md
```

## Architecture

### Backend Architecture

The backend follows a modular layered architecture:

```text
Module
├── Controller
├── Service
├── Repository
├── DTO / Schema
└── Response Mapper
```

### Backend Modules

| Module | Responsibility |
| --- | --- |
| `auth` | Authentication and OTP flows |
| `user` | User information |
| `candidate` | Candidate profiles |
| `candidate-dashboard` | Candidate dashboard data |
| `recruiter` | Recruiter profiles and management |
| `recruiter-dashboard` | Recruiter dashboard data |
| `job` | Job creation and management |
| `application` | Job applications |

### Frontend Architecture

The frontend follows a feature-oriented modular structure:

```text
src/
├── modules/
│   ├── auth/
│   ├── job/
│   ├── candidate/
│   └── recruiter/
│
├── layouts/
├── routes/
├── shared/
├── context/
└── api/
```

Domain-specific functionality is kept inside its respective module while reusable functionality is placed under `shared`, `api`, `context`, and `layouts`.

## Authentication & Authorization

The application uses JWT-based authentication with role-based authorization.

Supported roles:

```text
CANDIDATE
RECRUITER
```

Frontend access control is implemented using:

- `ProtectedRoute`
- `RoleGuard`
- `AuthRedirect`

Backend authorization uses the authenticated user's ID to enforce resource ownership.

For example, recruiters can only modify jobs belonging to their own account.

## API

The backend exposes versioned REST APIs under:

```text
/api/v1
```

Major API areas include:

```text
/api/v1/auth
/api/v1/jobs
/api/v1/candidate
/api/v1/recruiter
/api/v1/recruiter/dashboard
/api/v1/applications
```

## Environment Configuration

Configure the backend environment variables before starting the application.

Example:

```env
NODE_ENV=development

PORT=8080
HOST=0.0.0.0

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=job_portal

JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1d

SALT_ROUNDS=10

EMAIL=your_email
EMAIL_PASSWORD=your_email_password

OTP_EXPIRY_MIN=15
```

> Never commit real credentials, secrets, or passwords to the repository.

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd job-portal
```

### Backend Installation

```bash
cd backend
npm install
```

Configure the required environment variables and PostgreSQL database.

Start the backend:

```bash
npm run dev
```

### Frontend Installation

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

## Build

### Backend Build

```bash
cd backend
npm run build
```

### Frontend Build

```bash
cd frontend
npm run build
```

## Development Phases

The project was developed incrementally through five phases.

### Phase 1 — Authentication System

Branch:

`frontend-phase-1-authentication-system`

Implemented:

- Authentication API integration
- Login
- Registration
- OTP authentication
- Authentication context
- Protected routes
- Role guards
- Authentication validation

Commit:

`2b492a5 feat(auth): implement frontend authentication system`

### Phase 2 — Public Jobs

Branch:

`frontend-phase-2-public-jobs`

Implemented:

- Public job browsing
- Job details
- Job API integration
- Public home page

Commit:

`76b0a26 feat(jobs): implement public job browsing`

### Phase 3 — Candidate

Branch:

`frontend-phase-3-candidate`

Implemented:

- Candidate dashboard
- Candidate profile
- Candidate applications
- Candidate API integration
- Candidate validation
- Candidate dashboard backend integration

Commit:

`1768f09 feat(candidate): implement candidate features`

### Phase 4 — Recruiter

Branch:

`frontend-phase-4-recruiter`

Implemented:

- Recruiter dashboard
- Recruiter profile
- Recruiter job management
- Recruiter applications
- Recent applications
- Application status management
- Job status management
- Recruiter ownership checks

Commit:

`4039f91 feat(recruiter): implement recruiter features`

### Phase 5 — Infrastructure & Architecture

Branch:

`frontend-phase-5-infrastructure`

Implemented:

- Shared application layouts
- Frontend entry-point restructuring
- Bootstrap integration
- Alert infrastructure
- Error page
- Backend environment configuration
- Mail configuration
- TypeScript configuration
- Removal of obsolete frontend architecture

Commit:

`e68748f chore: finalize application infrastructure`

## Git History

The completed development phases follow a linear progression:

```text
Phase 1
   ↓
Phase 2
   ↓
Phase 3
   ↓
Phase 4
   ↓
Phase 5
   ↓
main
```

The completed Phase 5 implementation was merged into `main`.

The previous complete WIP implementation is preserved separately in:

`frontend-complete-wip`

## Current Status

The project currently includes:

- Authentication
- Candidate workflows
- Recruiter workflows
- Public job browsing
- Job management
- Application management
- Candidate dashboard
- Recruiter dashboard
- Role-based authorization
- OTP authentication
- Email functionality
- Shared frontend infrastructure
- Modular backend architecture
- Modular frontend architecture

The `main` branch contains the completed phased implementation.

## License

This project is intended for educational and development purposes
