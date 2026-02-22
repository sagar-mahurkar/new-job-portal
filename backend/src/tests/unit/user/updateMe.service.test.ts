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

// bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword")
}))

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */

import { userRepository } from "@/modules/user/user.repository";
import { UserService } from "@/modules/user/user.service";

const userService = new UserService();

describe("userService.updateMe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  // email already exists
  it("should fail if email already exists", async () => {
    const mockedUserProfile = {
      id: "1",
      name: "john",
      email: "john@example.com",
      password: "password",
      role: "RECRUITER",
      isActive: true
    };

    // First call → fetch current user
    // Second call → email conflict
    (userRepository.findOne as jest.Mock)
      .mockResolvedValueOnce(mockedUserProfile)
      .mockResolvedValueOnce({
        id: "2",
        email: "john123@example.com"
      });

    await expect(
      userService.updateMe("1", { email: "john123@example.com" })
    ).rejects.toMatchObject({
      statusCode: 409
    });

    expect(userRepository.findOne).toHaveBeenCalledTimes(2);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" }
    });
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john123@example.com" }
    });

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  // valid update
  it("should successfully update and return user profile", async () => {
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

    (userRepository.findOne as jest.Mock)
      .mockResolvedValueOnce(mockedUserProfile)
      .mockResolvedValueOnce(null)

    const updatedUserProfile = {
      name: "john123",
      email: "john123@example.com",
      password: "password123"
    };

    const result = await userService.updateMe("1", updatedUserProfile);

    expect(result).toMatchObject(expect.objectContaining({
      name: "john123",
      email: "john123@example.com",
      password: "hashedPassword"
    }));

    expect(userRepository.findOne).toHaveBeenCalledTimes(2);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" }
    });
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john123@example.com" }
    });

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "john123",
        email: "john123@example.com",
        password: "hashedPassword"
      })
    );

    expect(result.name).toBe("john123");
    expect(result.email).toBe("john123@example.com");
    expect(result.password).toBe("hashedPassword");
  })

  // same value update
  it("should successfully update even for same values and return user profile", async () => {
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

    (userRepository.findOne as jest.Mock)
      .mockResolvedValueOnce(mockedUserProfile)
      .mockResolvedValueOnce(null)

    const updatedUserProfile = {
      name: "john",
      email: "john@example.com",
      password: "password"
    };

    const result = await userService.updateMe("1", updatedUserProfile);

    expect(result).toMatchObject(expect.objectContaining({
      name: "john",
      email: "john@example.com",
      password: "hashedPassword"
    }));

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" }
    });
    // NOTE: As email is same as before, findOne will not be called second time
    // Refer: @/modules/user/user.service.ts

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "john",
        email: "john@example.com",
        password: "hashedPassword"
      })
    );

    expect(result.name).toBe("john");
    expect(result.email).toBe("john@example.com");
    expect(result.password).toBe("hashedPassword");
  })
})
