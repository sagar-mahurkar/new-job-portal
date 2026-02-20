import { requestOtpSchema } from "@/modules/auth/dtos";

describe("requestOtpSchema", () => {
  it("should validate correct payload", () => {
    const data = {
      email: "test@example.com",
    };

    const result = requestOtpSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it("should fail for email is missing", () => {
    const data = {
    };

    const result = requestOtpSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail for invalid email format", () => {
    const data = {
      email: "invalid-email",
    };

    const result = requestOtpSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail for empty string email", () => {
    const data = {
      email: "",
    };

    const result = requestOtpSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail for email as number format", () => {
    const data = {
      email: 123456,
    };

    const result = requestOtpSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail for email as null format", () => {
    const data = {
      email: null,
    };

    const result = requestOtpSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

})