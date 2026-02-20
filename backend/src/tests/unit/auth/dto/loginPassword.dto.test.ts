import { loginPasswordSchema } from "@/modules/auth/dtos";

describe("loginPasswordSchema", () => {
  // Invalid email format
  it("should fail for invalid email", async () => {
    const data = {
      email: "invalid-email",
      password: "password123"
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // Missing Password
  it("should fail for missing password", async () => {
    const data = {
      email: "john@example.com",
    }

    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // Invalid password (char < 8)
  it("should fail for password less than 8 characters", async () => {
    const data = {
      email: "john@example.com",
      password: "pass12"
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // Empty string email
  it("should fail for empty string email", async () => {
    const data = {
      email: "",
      password: "password123"
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // Empty string password
  it("should fail for empty string password", async () => {
    const data = {
      email: "john@example.com",
      password: ""
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // email = null
  it("should fail for null email", async () => {
    const data = {
      email: null,
      password: "password123"
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // password = null
  it("should fail for null password", async () => {
    const data = {
      email: "john@example.com",
      password: null
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // email = number
  it("should fail for number email format", async () => {
    const data = {
      email: 123456,
      password: "password123"
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // password = number
  it("should fail for number password format", async () => {
    const data = {
      email: "john@example.com",
      password: 12345678
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // happy-path
  it("should validate correct payload", async () => {
    const data = {
      email: "john@example.com",
      password: "password123"
    }
    const result = loginPasswordSchema.safeParse(data);

    expect(result.success).toBe(true);
  })

})