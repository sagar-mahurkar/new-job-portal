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

- id (uuid, primary key)
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

  ```typescript
  export const repoName: Repository<Entity> = DataSourceName.getRepository(Entity);
  ```

🚫 No controller yet

🚫 No routes yet

### Step 2: Auth module

Target:

- signup (recruiter)

- signup (candidate)

- login (password)

- login (otp)

Build order

1. DTOs (contracts)

    - login-otp.dto.ts

      ```typescript
      import { z } from "zod";

      export const loginOtpSchema = z.object({
        email: z.email().toLowerCase(),
        loginOtp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
      });

      export type LoginOtpDto = z.infer<typeof loginOtpSchema>;
      ```

    - login-password.dto.ts

      - email
      - password

    - request-otp.dto.ts

      - email

    - signup-candidate.dto.ts

      - name
      - email
      - password

    - signup-recruiter.dto.ts

      - name
      - email
      - password

    - index.ts

      ```typescript
      export * from "./signup-recruiter.dto";
      export * from "./signup-candidate.dto";
      export * from "./login-password.dto";
      export * from "./login-otp.dto";
      export * from "./request-otp.dto";
      ```

2. Service (business logic)

    ```typescript
    // Imports
    export class AuthService {
      // TODO: signupRecruiter()
      // 1. Check if user exists (throw error)
      // 2. Hash the plain-text password
      // 3. Create recruiter user entity
      // 4. Persist user in database
      // 5. Create recruiter profile in same transaction (Note: 3, 4, 5 goes in transaction)
      // 6. Generate JWT for authenticated session
      // 7. return user and token

      // TODO: signupCandidate()

      // TODO: loginWithPassword()
      // 1. Fetch user by email
      // 2. Validate user existence and password-based login eligibility (throw error)
      // 3. Ensure account is active
      // 4. Compare provided password with stored hash
      // 5. Generate JWT for authenticated session
      // 6. return user and token

      // TODO: requestLoginOtp()
      // 1. Fetch user by email
      // 2. Validate user existence and active status
      // 3. Prevent resending OTP if existing OTP is still valid
      // 4. Generate one-time-password (OTP)
      // 5. Store OTP and expiry timestamp
      // 6. Send OTP via email/SMS

      // TODO: resendLoginOtp()

      // TODO: loginWithOtp()
      // 1. Fetch user by email
      // 2. Validate OTP existence and expiry
      // 3. Clear OTP after successful verification
      // 4. Generate JWT for authenticated session

      // ============================
      // Private helper functions
      // ============================
      // TODO: hashPassword() -> async

      // TODO: comparePassword() -> async

      // TODO: generateJwt() -> userId, userRole

      // TODO: clearLoginOtp() -> async

      // TODO: sendOtpEmail() -> async
    }
    ```

3. Controller

    ```typescript
    // Imports
    export class AuthController {
      // TODO: signupRecruiter()
      static async signupRecruiter(req: Request, res: Response, next: NextFunction) {
        try {
          const dto = signupRecruiterSchema.parse(req.body);
          const result = await this.authService.signupRecruiter(dto);
          sendSuccessResponse(
            res,
            HttpStatusCodes.CREATED,
            result,
            "Recruiter created successfully"
          )
        } catch (err) {
          next(err);
        }
      }
      // TODO: signupCandidate()

      // TODO: loginWithPassword()

      // TODO: requestLoginOtp()

      // TODO: resendLoginOtp()

      // TODO: loginWithOtp()
    }
    ```

4. Routes

    ```typescript
    // Imports 
    const router = Router();

    // signup - recruiter
    router.post("/signup/recruiter", AuthController.signupRecruiter);
    // signup - candidate
    // login (password)
    // login (otp)
    // request
    // resend
    // verify
    ```

Why this order?

DTO defines API

Service defines rules

Controller only wires HTTP

### Step 3: Recruiter and Candidate modules (profile creation)

Target:

- recruiter.entity.ts

- candidate.entity.ts

- repositories only

Recruiter Fields

- userId
- companyName
- companySector
- description
- createdAt
- updatedAt

Relation

- user (1-1)

Candidate Fields

- userId
- currentSector
- experienceMonths
- qualification
- briefIntro
- resumeUrl
- linkedinUrl
- githubUrl
- portfolioUrl
- createdAt
- updatedAt

Relation

- user (1-1)

Creation happens inside AuthService, not controllers.

## Phase 1 Done when

- User can sign up

- User can log in

- JWT works

- Roles enforced

### Out of scope for Phase 1

- Refresh tokens

- Logout

- Password reset

- Email verification

- Rate limiting
