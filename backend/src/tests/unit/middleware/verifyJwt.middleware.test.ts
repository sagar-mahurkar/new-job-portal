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

jest.mock("jsonwebtoken");

jest.mock("@/modules/user/user.repository");

jest.mock("@/config/logger.config", () => ({
  logger: {
    warn: jest.fn(),
  }
}));

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */
import jwt from "jsonwebtoken";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { userRepository } from "@/modules/user/user.repository";


describe("verifyJwt middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      headers: {},
    };

    res = {};

    next = jest.fn();
  });
  
  // 1️⃣ No Authorization header
  it("should return 401 if Authorization header is missing", async () => {
    await verifyJwt(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(userRepository.findOne).not.toHaveBeenCalled();
  });
  
  // 2️⃣ Invalid header format
  it("should return 401 if token is missing after Bearer", async () => {
    req.headers.authorization = "Bearer ";

    await verifyJwt(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);

    expect(jwt.verify).not.toHaveBeenCalled();
  });

  // 3️⃣ jwt.verify throws
  it("should return 401 if jwt.verify throws", async () => {
    req.headers.authorization = "Bearer invalidToken";

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid");
    });

    await verifyJwt(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
  });
  
  // 4️⃣ Token valid but user not found
  it("should return 401 if user is not found", async () => {
    req.headers.authorization = "Bearer validToken";

    (jwt.verify as jest.Mock).mockReturnValue({
      sub: "1",
      role: "RECRUITER"
    });

    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    await verifyJwt(req, res, next);

    expect(userRepository.findOne).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);

    expect(next).toHaveBeenCalled();
  });

  // 5️⃣ User inactive
  it("should return 401 if user is inactive", async () => {
    req.headers.authorization = "Bearer validToken";

    (jwt.verify as jest.Mock).mockReturnValue({
      sub: "1",
      role: "RECRUITER"
    });

    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      role: "RECRUITER",
      isActive: false
    });

    await verifyJwt(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);

    expect(next).toHaveBeenCalled();
  });

  // 6️⃣ Valid token + active user
  it("should attach user and call next for valid token", async () => {
    req.headers.authorization = "Bearer validToken";

    (jwt.verify as jest.Mock).mockReturnValue({
      sub: "1",
      role: "RECRUITER"
    });

    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      role: "RECRUITER",
      isActive: true
    });

    await verifyJwt(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      expect.any(String)
    );

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" }
    });

    expect(req.user).toEqual({
      id: "1",
      role: "RECRUITER"
    });

    expect(next).toHaveBeenCalledWith();
  });
});