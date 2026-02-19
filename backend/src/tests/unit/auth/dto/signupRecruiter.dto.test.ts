import { signupRecruiterSchema } from "@/modules/auth/dtos"

describe("signupRecruiterSchema", () => {
  it("should fail for invalid email format", () => {
    const data = {
      name: "John",
      email: "invalid-email",
      password: "password123"
    };

    const result = signupRecruiterSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should pass for valid input", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123"
    };

    const result = signupRecruiterSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it("should fail if name is less than 3 characters", () => {
    const data = {
      name: "Jo",
      email: "john@example.com",
      password: "password123"
    };

    const result = signupRecruiterSchema.safeParse(data);
    console.log(result);

    expect(result.success).toBe(false);
  });

  it("should fail if name is a number", () => {
    const data = {
      name: 123,
      email: "john@example.com",
      password: "password123"
    };

    const result = signupRecruiterSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail if extra field is provided", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "ADMIN" // not allowed
    };

    const result = signupRecruiterSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail if required field is missing", () => {
    const data = {
      email: "john@example.com",
      password: "password123"
    };

    const result = signupRecruiterSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should fail if password is less than 8 characters", () => {
    const data = {
      name: "John",
      email: "john@example.com",
      password: "pass123"
    };

    const result = signupRecruiterSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should pass if password is exactly 8 characters", () => {
    const data = {
      name: "John",
      email: "john@example.com",
      password: "pass1234"
    };

    const result = signupRecruiterSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should pass if name is exactly 3 characters", () => {
    const data = {
      name: "Jon",
      email: "john@example.com",
      password: "password123"
    };

    const result = signupRecruiterSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should fail if email is null", () => {
    const result = signupRecruiterSchema.safeParse({
      name: "John",
      email: null,
      password: "password123"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if password is null", () => {
    const result = signupRecruiterSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: null
    });

    expect(result.success).toBe(false);
  });

  it("should fail if name is null", () => {
    const result = signupRecruiterSchema.safeParse({
      name: null,
      email: "john@example.com",
      password: "password123"
    });

    expect(result.success).toBe(false);
  });

});