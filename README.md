# PHASE-WISE DEVELOPMENT PLAN

## Phase 0: Project Foundation

### 🎯 Goal

Create a stable skeleton that never changes.

### Steps

1. Initialize project

    ```bash
    npm init -y
    ```

2. Setup TypeScript

3. Setup Express

4. Setup folder structure (empty modules)

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

    🚫 No feature flags

    🚫 No role logic

2. `config/database.config.ts`

    **Purpose**
    - Create DB config
    - Export DataSource / Prisma client

    **What to implement**
    - Connection options
    - Logging toggle

    🚫 No repositories

    🚫 No entities

3. `loaders/db.loader.ts`

    **Purpose**
    - Connect DB at startup

    **What to implement**
    - initialize()
    - Proper logging on success/failure

    🚫 No queries

4. `config/logger.config.ts`

    **Purpose**
    - Central logging utility

    **What to implement**
    - info, error, warn
    - Wrapper around console (for now)

    🚫 No request logs yet

5. `common/errors/AppError.ts`

    **Purpose**
    - Custom error type

    **What to implement**
    - message
    - statusCode
    - `isOperational` flag

    🚫 No HTTP handling here

6. `middlewares/error.middleware.ts`

    **Purpose**
    - Catch all thrown errors
    - Send uniform response

    **What to implement**
    - Handle AppError
    - Handle unknown errors

    🚫 No business messages

7. `common/utils/response.util.ts`

    **Purpose**
    - Standard API responses

    **What to implement**
    - `sendSuccess`
    - `sendError` (optional)

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

    🚫 No routes yet (except /health)

### Output after Phase 0

```bash
src/
├── config/
├── loaders/
├── common/
├── middlewares/
├── routes/
└── modules/
```

🚨 No business logic yet.
