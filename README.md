# PHASE-WISE DEVELOPMENT PLAN

## Phase 0: Project Foundation

- Phase 0 code is considered infrastructure.

- Once stabilized, it should rarely change and should not contain business logic.

### 🎯 Goal

Create a stable skeleton that never changes.

### Steps

1. Initialize project

    ```bash
    npm init -y
    ```

2. Setup TypeScript

    ```bash
    tsc --init
    ```

3. Setup Express

    ```bash
    npm install bcrypt cors dotenv express jsonwebtoken nodemailer pg typeorm zod
    ```

    ```bash
    npm install --save-dev @types/express @types/node nodemon ts-node typescript
    ```

4. Setup folder structure (empty modules)

    ```bash
    .
    ├── common
    │   ├── constants
    │   ├── errors
    │   └── utils
    ├── config
    ├── index.ts
    ├── loaders
    ├── middlewares
    ├── modules
    │   ├── application
    │   ├── auth
    │   ├── candidate
    │   ├── job
    │   ├── recruiter
    │   └── user
    ├── routes
    └── tests
    ```

5. Setup:

    - env loader

    - DB connection

    - global error handler

    - response formatter

    - logger

### Step 5 Setup

1. `config/env.config.ts` (FIRST)

    **Purpose**
    - Load env
    - Validate env
    - Export config

    **What to implement (minimum)**
    - `dotenv.config()`
    - Throw error if critical env missing

    ```typescript
    // Imports

    // Bootstrap NODE_ENV

    // Load env

    // Define env schema

    // Validate env

    // Throw error if critical env missing

    // Export config

    ```

    🚫 No feature flags

    🚫 No role logic

2. `config/database.config.ts`

    **Purpose**
    - Create DB config
    - Export DataSource / Prisma client

    **What to implement**
    - Connection options
    - Logging toggle

    ```typescript
    // Imports

    // Create DB Config as DataSourceOptions

    // Instantiate and Export DataSource Object

    ```

    🚫 No repositories

    🚫 No entities

3. `loaders/db.loader.ts`

    **Purpose**
    - Connect DB at startup

    **What to implement**
    - initialize()
    - Proper logging on success/failure

    ```typescript
    // Imports

    // Declare and Export initDB (async function)

    // Check if db is already initialized

    // Initiate db

    // Log error if operation fails

    ```

    🚫 No queries

4. `config/logger.config.ts`

    **Purpose**
    - Central logging utility

    **What to implement**
    - info, error, warn
    - Wrapper around console (for now)

    ```typescript
    // Imports

    // Define type LogLevel - info, warn, error, debug

    // Define isProductionLike flag

    // Create log formatter 

    // Export logger object

    ```

    🚫 No request logs yet

5. `common/errors/AppError.ts`

    **Purpose**
    - Custom error type

    **What to implement**
    - message
    - statusCode
    - `isOperational` flag

    ```typescript
    // Export class AppError which extends Error class

    // ReadOnly variables - statusCode, isOperational

    // Capture Stack trace

    ```

    🚫 No HTTP handling here

6. `middlewares/error.middleware.ts`

    **Purpose**
    - Catch all thrown errors
    - Send uniform response

    **What to implement**
    - Handle AppError
    - Handle unknown errors

    ```typescript
    // Imports

    // Express error middleware

    // If AppError → send status + message
    // Else → log error, return 500

    ```

    🚫 No business messages

7. `common/utils/response.util.ts`

    **Purpose**
    - Standard API responses

    **What to implement**
    - `sendSuccess`
    - `sendError` (optional)

    ```typescript
    // Imports

    // Define interfaces SuccessResponse (Generic), ErrorResponse

    // Declare and Export sendSuccess, sendError functions

    ```

    **Note:** Most errors should be handled by `error.middleware.ts`.

    🚫 No controller logic

8. `index.ts` (last in Phase 0)

    **Purpose**
    - Wire everything
    - Start server

    **What to implement**
    - Express app
    - JSON parser
    - Error middleware
    - Health route
    - DB loader call
    - Server bootstrap (listen)

    ```typescript
    // Import logger, initDB, errorMiddleware, DataSource, env

    // Express app

    // Middlewares

    // Health route (NO DB QUERY)

    // Error middleware (must be last)

    // Server bootstrap
    
    ```

    🚫 No routes yet (except /health)

### Output after Phase 0

```bash
.
├── backend
│   ├── package.json
│   ├── package-lock.json
│   ├── src
│   │   ├── common
│   │   │   ├── constants
│   │   │   │   └── http.codes.ts
│   │   │   ├── errors
│   │   │   │   └── AppError.ts
│   │   │   └── utils
│   │   │       └── response.util.ts
│   │   ├── config
│   │   │   ├── database.config.ts
│   │   │   ├── env.config.ts
│   │   │   └── logger.config.ts
│   │   ├── index.ts
│   │   ├── loaders
│   │   │   └── db.loader.ts
│   │   ├── middlewares
│   │   │   └── error.middleware.ts
│   │   ├── modules
│   │   │   ├── application
│   │   │   ├── auth
│   │   │   ├── candidate
│   │   │   ├── job
│   │   │   ├── recruiter
│   │   │   └── user
│   │   ├── routes
│   │   └── tests
│   └── tsconfig.json
├── environments
└── README.md
```

🚨 No business logic yet.

### ✅ Phase 0 Done When

- App starts successfully
- Invalid env fails fast
- Database connects once at startup
- `/health` returns 200 OK
- Errors are handled centrally
- No feature code exists
