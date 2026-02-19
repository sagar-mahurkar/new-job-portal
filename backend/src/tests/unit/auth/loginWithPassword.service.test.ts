// --------------------
// Module Mocks (TOP)
// --------------------

jest.mock("@/config/env.config", () => ({
  env: {
    NODE_ENV: "test",
    POSTGRES_HOST: "localhost",
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

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked-jwt-token")
}));

// --------------------
// Imports (AFTER MOCKS)
// --------------------
import { AuthService } from "@/modules/auth/auth.service";
import { userRepository } from "@/modules/user/user.repository";
import { AppError } from "@/common/errors/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authService = new AuthService();

describe("authService.loginWithPassword", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if user not found", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.loginWithPassword({
        email: "john@example.com",
        password: "password123"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });

  });

  it("should throw error if user exists but has no password", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      password: null,
      isActive: true
    });

    await expect(
      authService.loginWithPassword({
        email: "john@example.com",
        password: "password123"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  });

  it("should throw error if account is disabled", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      password: "hashedPassword",
      isActive: false
    });

    await expect(
      authService.loginWithPassword({
        email: "john@example.com",
        password: "password123"
      })
    ).rejects.toMatchObject({
      statusCode: 403
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });

  });

  it("should throw error if password is incorrect", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      password: "hashedPassword",
      isActive: true
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.loginWithPassword({
        email: "john@example.com",
        password: "wrongPassword"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });

  });

  it("should return user and token when credentials are valid", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      password: "hashedPassword",
      role: "RECRUITER",
      isActive: true
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.loginWithPassword({
      email: "john@example.com",
      password: "password123"
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: "1", role: "RECRUITER" },
      "testsecret123",
      { expiresIn: "1d" }
    );
    
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);

    expect(result.user.email).toBe("john@example.com");
    expect(result.token).toBe("mocked-jwt-token");
    
  });


});
