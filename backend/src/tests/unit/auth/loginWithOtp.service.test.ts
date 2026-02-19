/**
 * -----------------------------------------------------------
 * MOCKS (TOP)
 * -----------------------------------------------------------
 */

// Mock env.config
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

// Mock userRepository
jest.mock("@/modules/user/user.repository", () => ({
  userRepository: {
    findOne: jest.fn(),
    save: jest.fn()
  }
}))

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedOtp"),
  compare: jest.fn()
}));

// Mock jsonwebtoken.sign
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked-jwt-token")
}));

/**
 * ----------------------------------------------------------
 * Imports (AFTER MOCKS)
 * ----------------------------------------------------------
 */
import { userRepository } from "@/modules/user/user.repository"
import { AuthService } from "@/modules/auth/auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authService = new AuthService();

describe("authService.loginWithOtp", () => {
  // aftereach block
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Email not found -> 401
  it("should fail for email not found", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);
    await expect(
      authService.loginWithOtp({
        email: "john@example.com",
        loginOtp: "123456"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  })

  // User deactivated -> 401
  it("should fail for deactivated user", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: false
    });
    await expect(
      authService.loginWithOtp({
        email: "john@example.com",
        loginOtp: "123456"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  })

  // loginOtp is missing -> 401
  it("should fail for loginOtp is missing in repository", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: true,
      loginOtp: undefined,
      loginOtpExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });
    await expect(
      authService.loginWithOtp({
        email: "john@example.com",
        loginOtp: "123456"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  })

  // loginOtpExpiresAt is missing -> 401
  it("should fail for loginOtpExpiresAt is missing in repository", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: true,
      loginOtp: "hashedOtp",
      loginOtpExpiresAt: undefined
    });
    await expect(
      authService.loginWithOtp({
        email: "john@example.com",
        loginOtp: "123456"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  })

  // OTP expired -> 401
  it("should fail for expired OTP", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: true,
      loginOtp: "hashedOtp",
      loginOtpExpiresAt: new Date(Date.now() - 1 * 60 * 1000)
    });
    await expect(
      authService.loginWithOtp({
        email: "john@example.com",
        loginOtp: "123456"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  })

  // OTP incorrect -> 401
  it("should fail for incorrect OTP", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: true,
      loginOtp: "hashedOtp",
      loginOtpExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    
    await expect(
      authService.loginWithOtp({
        email: "john@example.com",
        loginOtp: "123456"
      })
    ).rejects.toMatchObject({
      statusCode: 401
    });

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "123456",
      "hashedOtp"
    );

    expect(jwt.sign).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  })

  // Valid OTP -> 200 -> success path
  it("should validate OTP and return user + token", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: true,
      loginOtp: "hashedOtp",
      loginOtpExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.loginWithOtp({
      email: "john@example.com", 
      loginOtp: "123456"
    });

    expect(result).toMatchObject({
      token: "mocked-jwt-token",
      user: expect.objectContaining({
        id: "1",
        email: "john@example.com"
      })
    })

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "123456",
      "hashedOtp"
    );

    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: "1", role: undefined }, // or actual role if present
      "testsecret123",
      { expiresIn: "1d" }
    );


    expect(userRepository.save).toHaveBeenCalledTimes(1);
    const savedUser = (userRepository.save as jest.Mock).mock.calls[0][0];

    expect(savedUser.id).toBe("1");
    expect(savedUser.email).toBe("john@example.com");
    expect(savedUser.loginOtp).toBeNull();
    expect(savedUser.loginOtpExpiresAt).toBeNull();


    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" }
    });
  })
})