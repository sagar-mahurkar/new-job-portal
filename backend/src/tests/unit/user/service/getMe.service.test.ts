/**
 * --------------------------------------------------------------------
 * MOCKS (TOP)
 * --------------------------------------------------------------------
 */

// env.config
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
}))

// user repository
jest.mock("@/modules/user/user.repository", () => ({
  userRepository: {
    findOne: jest.fn(),
    save: jest.fn()
  }
}))

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */

import { userRepository } from "@/modules/user/user.repository";
import { UserService } from "@/modules/user/user.service";

const userService = new UserService();

describe("userService.getMe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  // user profile not found
  it("should fail for user profile not found", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userService.getMe("1")).rejects.toMatchObject({
      statusCode: 404
    });

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1"}
    });
  })

  // happy-path
  it("should successfully return the user profile", async () => {
    const mockedUserProfile = {
      id: "1",
      name: "john",
      email: "john@example.com",
      password: "password",
      role: "RECRUITER",
      isActive: true,
      loginOtp: undefined,
      loginOtpExpiresAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    (userRepository.findOne as jest.Mock).mockResolvedValue(mockedUserProfile);

    const result = await userService.getMe("1");

    expect(result).toMatchObject(mockedUserProfile);
    
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" }
    })
  })
})

