import { loginOtpSchema } from "@/modules/auth/dtos";

describe("loginOtpSchema", () => {
  it("should validate correct payload", () => {
    const data = {
      email: "test@example.com",
      loginOtp: "123456"
    };

    const result = loginOtpSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it("should fail for invalid email format", () => {
    const result = loginOtpSchema.safeParse({
      email: "invalid-email",
      loginOtp: "123456"
    });

    expect(result.success).toBe(false);
  });

  it("should fail for email is missing", () => {
    const result = loginOtpSchema.safeParse({
      loginOtp: "123456"
    });

    expect(result.success).toBe(false);
  });

  it("should fail for login otp is missing", () => {
    const result = loginOtpSchema.safeParse({
      email: "john@example.com"
    });

    expect(result.success).toBe(false);
  });

  it("should fail for null email format", () => {
    const result = loginOtpSchema.safeParse({
      email: null,
      loginOtp: "123456"
    });

    expect(result.success).toBe(false);
  });

  it("should fail for null otp format", () => {
    const result = loginOtpSchema.safeParse({
      email: "john@example.com",
      loginOtp: null
    });

    expect(result.success).toBe(false);
  });

  it("should fail for empty string email format", () => {
    const result = loginOtpSchema.safeParse({
      email: "",
      loginOtp: "123456"
    });

    expect(result.success).toBe(false);
  });

  it("should fail for empty string otp format", () => {
    const result = loginOtpSchema.safeParse({
      email: "john@example.com",
      loginOtp: ""
    });

    expect(result.success).toBe(false);
  });


  it("should fail for email as number format", () => {
    const result = loginOtpSchema.safeParse({
      email: 12354,
      loginOtp: "123456"
    });

    expect(result.success).toBe(false);
  });

  it("should fail for login otp as number format", () => {
    const result = loginOtpSchema.safeParse({
      email: "john@example.com",
      loginOtp: 123456
    });

    expect(result.success).toBe(false);
  });

  it("should fail if OTP is less than 6 digits", () => {
    const result = loginOtpSchema.safeParse({
      email: "test@example.com",
      loginOtp: "12345"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if OTP is more than 6 digits", () => {
    const result = loginOtpSchema.safeParse({
      email: "test@example.com",
      loginOtp: "1234567"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if extra field provided", () => {
    const result = loginOtpSchema.safeParse({
      email: "test@example.com",
      loginOtp: "123456",
      role: "ADMIN"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if OTP contains letters", () => {
    const result = loginOtpSchema.safeParse({
      email: "john@example.com",
      loginOtp: "12a456"
    });

    expect(result.success).toBe(false);
  });

});
