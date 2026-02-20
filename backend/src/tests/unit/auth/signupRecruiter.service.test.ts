// --------------------
// Module Mocks (TOP)
// --------------------

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

jest.mock("@/modules/user/user.repository", () => ({
  userRepository: {
    findOne: jest.fn(),
    save: jest.fn()
  }
}));

jest.mock("@/config/database.config", () => ({
  JobPortalDataSource: {
    transaction: jest.fn()
  }
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword")
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked-jwt-token")
}));

// --------------------
// Imports (AFTER MOCKS)
// --------------------

import { AuthService } from "@/modules/auth/auth.service";
import { userRepository } from "@/modules/user/user.repository";
import { JobPortalDataSource } from "@/config/database.config";
import { AppError } from "@/common/errors/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authService = new AuthService();

describe("authService.signupRecruiter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if email already exists", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com"
    });

    await expect(
      authService.signupRecruiter({
        name: "John",
        email: "john@example.com",
        password: "password123"
      })
    ).rejects.toMatchObject({
      statusCode: 409
    });
  });

  it("should hash password, save recruiter and return user + token", async () => {
    // No existing user
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    // Mock transaction behavior
    let fakeManager: any; 
    (JobPortalDataSource.transaction as jest.Mock).mockImplementation(
      async (callback: any) => {
        fakeManager = {
          create: jest.fn((_, data) => ({ id: "generated-id", ...data })),
          save: jest.fn(async (entity) => entity)
        };

        return callback(fakeManager);
      }
    );

    const result = await authService.signupRecruiter({
      name: "John",
      email: "john@example.com",
      password: "password123"
    });

    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: result.user.id, role: result.user.role },
      "testsecret123",
      { expiresIn: "1d" }
    );
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(JobPortalDataSource.transaction).toHaveBeenCalled();
    expect(result.user.email).toBe("john@example.com");
    expect(result.user.password).toBe("hashedPassword");
    expect(result.token).toBe("mocked-jwt-token");
    expect(fakeManager.create).toHaveBeenCalledTimes(2);
    expect(fakeManager.create).toHaveBeenNthCalledWith(
      1,
      expect.anything(), // User entity class
      expect.objectContaining({
        email: "john@example.com",
        password: "hashedPassword"
      })
    );

    expect(fakeManager.create).toHaveBeenNthCalledWith(
      2,
      expect.anything(), // Recruiter entity class
      expect.objectContaining({})
    );
    expect(fakeManager.save).toHaveBeenCalledTimes(2);
  });

  it("should propagate error if transaction fails", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    (JobPortalDataSource.transaction as jest.Mock).mockRejectedValue(
      new Error("DB failure")
    );

    await expect(
      authService.signupRecruiter({
        name: "John",
        email: "john@example.com",
        password: "password123"
      })
    ).rejects.toThrow("DB failure");
  });

});
