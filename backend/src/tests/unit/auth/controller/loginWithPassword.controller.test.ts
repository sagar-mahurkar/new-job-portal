/**
 * -----------------------------------------------------------
 * MOCKS (TOP)
 * -----------------------------------------------------------
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

jest.mock("@/modules/auth/auth.service");

jest.mock("@/modules/auth/dtos");

/**
 * ----------------------------------------------------------
 * Imports (AFTER MOCKS)
 * ----------------------------------------------------------
 */

import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { loginPasswordSchema } from "@/modules/auth/dtos";


const mockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe("AuthController.loginWithPassword", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    (loginPasswordSchema.parse as jest.Mock)
      .mockImplementation((body) => body);

    req = { body: {} };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it("should return 200 on success", async () => {
    const mockServiceReturn: any = {
      user: { 
        id: "1", 
        name: "John",
        email: "john@example.com",
        password: "hashed-password123",
        role: "RECRUITER",
        isActive: true,
        loginOtp: undefined,
        loginOtpExpiresAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: "abc"
    };

    mockedAuthService.prototype.loginWithPassword
      .mockResolvedValue(mockServiceReturn);

    req.body = {
      email: "john@example.com",
      password: "password123"
    };

    await AuthController.loginWithPassword(req, res, next);

    expect(mockedAuthService.prototype.loginWithPassword)
      .toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        user: {
          id: "1",
          name: "John",
          email: "john@example.com",
          role: "RECRUITER"
        },
        accessToken: "abc"
      },
      message: "User logged in successfully"
    });

    const response = (res.json as jest.Mock).mock.calls[0][0];

    expect(next).not.toHaveBeenCalled();
    expect(response.data.user).not.toHaveProperty("password");
    expect(response.data.user).not.toHaveProperty("loginOtp");
  });

  it("should call next on error", async () => {
    const error = new Error("fail");

    mockedAuthService.prototype.loginWithPassword
      .mockRejectedValue(error);

    await AuthController.loginWithPassword(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});