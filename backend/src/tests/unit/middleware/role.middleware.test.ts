/**
 * --------------------------------------------------------------------
 * MOCKS (TOP)
 * --------------------------------------------------------------------
 */
jest.mock("@/config/env.config", () => ({
  env: {
    NODE_ENV: "test",
    POSTGRES_HOST: "0.0.0.0",
    POSTGRES_PORT: 5432,
    POSTGRES_USERNAME: "test",
    POSTGRES_PASSWORD: "test",
    POSTGRES_DATABASE: "test",
    PORT: 3000,
    JWT_SECRET: "testsecret123",
  }
}));

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */

import { requireRole } from "@/middlewares/role.middleware";
import { HttpStatusCodes } from "@/common/constants/http.codes";

describe("requireRole middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  /**
   * 1️⃣ No req.user
   */
  it("should return 401 if req.user is missing", () => {
    const middleware = requireRole("RECRUITER");

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(HttpStatusCodes.UNAUTHORIZED);
  });

  /**
   * 2️⃣ Role not allowed
   */
  it("should return 403 if role is not allowed", () => {
    req.user = { role: "CANDIDATE" };

    const middleware = requireRole("RECRUITER");

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(HttpStatusCodes.FORBIDDEN);
  });

  /**
   * 3️⃣ Role allowed
   */
  it("should call next if role is allowed", () => {
    req.user = { role: "RECRUITER" };

    const middleware = requireRole("RECRUITER");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  /**
   * 4️⃣ Multiple allowed roles
   */
  it("should allow access if role is in allowed roles", () => {
    req.user = { role: "CANDIDATE" };

    const middleware = requireRole("RECRUITER", "CANDIDATE");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});