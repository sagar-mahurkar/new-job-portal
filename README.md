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

### Step 5 Setup

1. `config/env.config.ts` (FIRST)

    **Purpose**\
    - Load env
    - Validate env
    - Export config

What to implement (minimum)

dotenv.config()

Throw error if critical env missing

🚫 No feature flags
🚫 No role logic
