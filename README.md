# Phase 0 – Frontend Project Foundation

> Branch: `frontend-phase-0-project-foundation`
> Parent branch: `main`
> Status: Completed

---

## 🎯 Objective

Establish a **production-grade frontend foundation** for the job portal application.

This phase focuses on setting up the **core architecture and infrastructure** required for future feature development.

This includes:

* React project initialization
* Feature-based folder architecture
* Global API client setup
* Authentication state management
* Router architecture
* Protected route guard
* React Query infrastructure

No business logic or UI features were implemented in this phase.

All pages created in this phase are **placeholder pages used only to verify routing functionality**.

---

## 📦 Scope

This phase establishes the **core frontend infrastructure** required for all upcoming phases.

The following systems were introduced:

* Project initialization (Vite + React + TypeScript)
* Global Axios API client
* Authentication context
* Custom auth hook
* React Router architecture
* Public and protected route structure
* Route protection guard
* React Query provider

---

## 🧱 Project Initialization

Frontend project created using **Vite with React + TypeScript**.

Command used:

```code
npm create vite@latest frontend
```

Configuration selected:

```text
Framework: React
Variant: TypeScript
```

Dependencies installed:

```code
npm install
```

Development server:

```code
npm run dev
```

---

## 📦 Core Libraries Installed

The following libraries were added as part of the foundation.

```code
react-router-dom
axios
bootstrap
bootstrap-icons
@tanstack/react-query
```

Purpose:

| Library               | Purpose                               |
| --------------------- | ------------------------------------- |
| react-router-dom      | Client-side routing                   |
| axios                 | HTTP client for backend communication |
| bootstrap             | Base UI styling                       |
| bootstrap-icons       | Icon set                              |
| @tanstack/react-query | Server state management               |

---

## 🗂 Folder Architecture

The project uses **feature-based architecture** to ensure scalability.

```text
src
├ app
│  ├ router
│  │  ├ index.tsx
│  │  ├ PublicRoutes.tsx
│  │  ├ ProtectedRoutes.tsx
│  │  └ ProtectedRoute.tsx
│  │
│  └ providers
│     └ QueryProvider.tsx
│
├ api
│  └ axios.ts
│
├ features
│  ├ auth
│  │  ├ api
│  │  ├ components
│  │  ├ pages
│  │  ├ hooks
│  │  └ context
│  │
│  ├ candidate
│  ├ recruiter
│  └ jobs
│
├ shared
│  ├ components
│  ├ hooks
│  └ types
```

Design principles:

* **Feature isolation**
* **Centralized infrastructure**
* **Reusable shared utilities**

---

## 🌐 Axios API Client

A centralized Axios client was implemented.

File:

```text
src/api/axios.ts
```

Responsibilities:

* Base API URL configuration
* Default JSON headers
* Automatic JWT token injection
* Global error handling

### Request Interceptor

Purpose:

Attach JWT token automatically.

Token source:

```text
localStorage
```

Header added:

```text
Authorization: Bearer <token>
```

---

### Response Interceptor

Purpose:

Handle authentication failures globally.

Behavior:

```text
401 → remove token
401 → redirect to login page
```

---

## 🔐 Authentication Context

Global authentication state implemented using React Context.

File:

```text
features/auth/context/AuthContext.tsx
```

Context exposes:

```text
token
user
login()
logout()
```

### Token Persistence

Token is restored on application startup.

Flow:

```text
Application loads
↓
AuthProvider initializes
↓
localStorage token retrieved
↓
token restored into React state
```

---

## 🪝 useAuth Hook

A custom hook was implemented for accessing authentication state.

File:

```text
features/auth/hooks/useAuth.ts
```

Responsibilities:

* Access AuthContext
* Enforce usage within AuthProvider
* Simplify component access to auth state

Usage example:

```typescript
const { token, logout } = useAuth()
```

---

## 🧭 Router Architecture

Routing implemented using **React Router**.

Router files:

```text
src/app/router
```

Structure:

```text
index.tsx
PublicRoutes.tsx
ProtectedRoutes.tsx
ProtectedRoute.tsx
```

---

## 🌍 Router Entry

Main router entry point:

```text
src/app/router/index.tsx
```

Responsibilities:

* Initialize `BrowserRouter`
* Combine route groups

Structure:

```text
BrowserRouter
   Routes
      PublicRoutes
      ProtectedRoutes
```

Important rule:

```text
BrowserRouter appears only once in the application.
```

---

## 🌐 Public Routes

File:

```text
PublicRoutes.tsx
```

Routes accessible **without authentication**.

Example routes:

```text
/login/password
/signup/candidate
/signup/recruiter
/login/otp/request
/login/otp/verify
/jobs
/jobs/:id
```

These routes correspond to placeholder pages used to verify routing.

---

## 🔒 Protected Routes

File:

```text
ProtectedRoutes.tsx
```

Routes requiring authentication.

Example:

```text
/candidate/dashboard
```

Protected routes wrap pages with the route guard.

Example structure:

```text
<Route
  path="/candidate/dashboard"
  element={
    <ProtectedRoute>
      <CandidateDashboardPage />
    </ProtectedRoute>
  }
/>
```

---

## 🛡 ProtectedRoute Guard

File:

```text
ProtectedRoute.tsx
```

Purpose:

Prevent unauthenticated users from accessing protected pages.

Logic:

```text
read token using useAuth()

if token exists
   render children

if token missing
   redirect to login page
```

Redirect handled via:

```text
<Navigate />
```

---

## ⚡ React Query Infrastructure

React Query was introduced for **server state management**.

Library:

```text
@tanstack/react-query
```

Provider implemented:

```text
app/providers/QueryProvider.tsx
```

Responsibilities:

* Create `QueryClient`
* Wrap application using `QueryClientProvider`

---

## 🧩 Provider Composition

Application providers are composed at the root.

Structure:

```text
<QueryProvider>
   <AuthProvider>
      <App />
   </AuthProvider>
</QueryProvider>
```

Purpose:

* Global access to React Query
* Global authentication state

---

## 🧪 Routing Verification

Placeholder pages were created to verify routing behavior.

Pages include:

* Auth pages
* Candidate pages
* Job pages

These pages contain **minimal placeholder content only**.

Purpose:

```text
verify route resolution
verify router structure
verify protected route behavior
```

---

## 🧠 Key Architectural Decisions

* Feature-based project architecture
* Centralized Axios API client
* Context-based authentication state
* Custom hook for auth access
* Separation of public and protected routes
* Dedicated route guard component
* Global server-state management via React Query
* Single BrowserRouter instance
* Placeholder pages used for structural validation

---

## ❌ Explicitly Excluded

This phase intentionally excludes:

* Authentication UI implementation
* Form validation logic
* API integrations
* Business logic
* UI component development
* Data fetching via React Query
* Styling beyond base bootstrap

---

## ✅ Phase Completion Criteria

* React project initialized
* Feature-based architecture implemented
* Axios client configured
* Authentication context implemented
* Custom auth hook implemented
* React Router architecture established
* Public routes implemented
* Protected routes implemented
* Route guard implemented
* React Query provider configured
* Placeholder pages created
* Router verified through manual testing
* Phase merged into `main`

---

> This document reflects the system state at the end of Phase 0 and remains frozen after merge.
