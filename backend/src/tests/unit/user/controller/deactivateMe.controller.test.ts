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

jest.mock("@/modules/user/user.service");


/**
 * ----------------------------------------------------------
 * Imports (AFTER MOCKS)
 * ----------------------------------------------------------
 */

import { UserController } from "@/modules/user/user.controller";
import { UserService } from "@/modules/user/user.service";

const mockedUserService = UserService as jest.MockedClass<typeof UserService>;

describe("UserController.deactivateMe", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      user: { id: "1" }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it("should return 200 on successfull deactivation", async () => {
    const mockUserProfile: any = {
      id: "1",
      name: "John",
      email: "john@example.com",
      password: "hashed-password123",
      role: "RECRUITER",
      loginOtp: undefined,
      loginOtpExpiresAt: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockedUserService.prototype.deactivateMe.mockResolvedValue(mockUserProfile);

    await UserController.deactivateMe(req, res, next);

    expect(mockedUserService.prototype.deactivateMe)
    .toHaveBeenCalledWith("1");

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonResponse = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.data).toEqual(null)
    expect(jsonResponse.message).toBe("User deactivated successfully")
    expect(next).not.toHaveBeenCalled();
  })

  it("should call next on service error", async () => {
    const error = new Error("fail");

    mockedUserService.prototype.deactivateMe
      .mockRejectedValue(error);

    await UserController.deactivateMe(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
})
