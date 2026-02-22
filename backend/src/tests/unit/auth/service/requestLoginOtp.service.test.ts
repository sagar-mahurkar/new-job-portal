/**
 * ------------------------------------------------------------
 * MODULE MOCKS (TOP) 
 * ------------------------------------------------------------
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
}))


jest.mock("@/modules/user/user.repository", () => ({
  userRepository: {
    findOne: jest.fn(),
    save: jest.fn()
  }
}));

jest.mock("@/config/mail.config", () => ({
  MailTransporter: {
    getInstance: jest.fn().mockImplementation(() => {
      return {
        sendEmail: jest.fn(),
      }
    })
  }
}))

jest.mock("fs/promises", () => ({
  readFile: jest.fn(),
}));

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */
import { userRepository } from "@/modules/user/user.repository";
import { AuthService } from "@/modules/auth/auth.service";
import bcrypt from "bcrypt";
import { MailTransporter } from "@/config/mail.config";
import * as fs from "fs/promises"

describe("service.requestLoginOtp", () => {
  let authService: AuthService;
  let sendEmailMock: jest.Mock;

  beforeEach(() => {
    sendEmailMock = jest.fn();
    (MailTransporter.getInstance as jest.Mock)
      .mockReturnValue({ sendEmail: sendEmailMock });

    authService = new AuthService();
    (fs.readFile as jest.Mock).mockResolvedValue("Hello {{ otp }}");
  })
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("should return silently if user is not found", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);
    
    const result = await authService.requestLoginOtp({
      email: "john@example.com"
    })
    
    expect(result).toBeUndefined();
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({where: {email: "john@example.com"}});
  });
  
  it("should return silently if user is not active", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: false
    })
    
    const result = await authService.requestLoginOtp({
      email: "john@example.com"
    })
    
    expect(result).toBeUndefined();
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({where: {email: "john@example.com"}});
  });
  
  it("should throw 429, too many requests for existing active otp", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: true,
      loginOtp: "hashed-otp",
      loginOtpExpiresAt: new Date(Date.now() + 15*60*1000),
    })
    
    await expect(authService.requestLoginOtp({
      email: "john@example.com"
    })).rejects.toMatchObject({
      statusCode: 429
    })
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({where: {email: "john@example.com"}});
    expect(userRepository.save).not.toHaveBeenCalled();
  })
  
  it("should successfully generate OTP and send email for a valid user", async() => {
    const otpSpy = jest.spyOn(authService as any, "generateLoginOtp").mockReturnValue("123456");
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-123456");
    (userRepository.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      isActive: true,
      loginOtp: undefined,
      loginOtpExpiresAt: undefined
    })
    
    const before = Date.now();
    await expect(authService.requestLoginOtp({
      email: "john@example.com"
    })).resolves.toBeUndefined()
    const after = Date.now();
    
    const savedUser = (userRepository.save as jest.Mock).mock.calls[0][0];
    const expires = savedUser.loginOtpExpiresAt.getTime();
    
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({where: {email: "john@example.com"}});
    
    expect(otpSpy).toHaveBeenCalledTimes(1);
    
    expect(savedUser.loginOtpExpiresAt).toBeInstanceOf(Date);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        loginOtp: "hashed-123456", 
        loginOtpExpiresAt: expect.any(Date)
      })
    );
    expect(expires).toBeGreaterThan(before);
    expect(expires).toBeLessThan(after + 15 * 60 * 1000 + 1000);
    
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const htmlArg = sendEmailMock.mock.calls[0][2];
    expect(htmlArg).toContain("123456");
    expect(sendEmailMock).toHaveBeenCalledWith(
      "john@example.com",
      "Job Portal - Your Login OTP",
      expect.any(String)
    );
  })
})