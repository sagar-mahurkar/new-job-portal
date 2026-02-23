import { updateUserSchema } from "@/modules/user/user.dto";

describe("updateUserSchema", () => {
  // invalid name (char < 3)
  it("should fail for invalid name with less than 3 char", async () => {
    const data = {
      name: "Jo",
      email: "john@example.com",
      password: "password"
    };

    const result = updateUserSchema.safeParse(data);

    expect(result.success).toBe(false);
  })
  
  // invalid email
  it("should fail for invalid email", async () => {
    const data = {
      name: "John",
      email: "invalid-email",
      password: "password"
    };

    const result = updateUserSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // invalid password (char < 8)
  it("should fail for invalid password with less than 8 char", async () => {
    const data = {
      name: "John",
      email: "john@example.com",
      password: "pass"
    };

    const result = updateUserSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // extra field is provide, role = "CANDIDATE"
  it("should fail for extra field provided", async () => {
    const data = {
      name: "John",
      email: "john@example.com",
      password: "password",
      role: "CANDIDATE"
    };

    const result = updateUserSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // boundary: name with exactly 3 char
  it("should pass for valid name with exactly 3 char", async () => {
    const data = {
      name: "Joh",
      email: "john@example.com",
      password: "password"
    };

    const result = updateUserSchema.safeParse(data);

    expect(result.success).toBe(true);
  })

  // boundary: password with exactly 8 char
  it("should pass for valid password with exactly 8 char", async () => {
    const data = {
      name: "John",
      email: "john@example.com",
      password: "password"
    };

    const result = updateUserSchema.safeParse(data);

    expect(result.success).toBe(true);
  })

  // valid update
  it("should fail for invalid name with less than 3 char", async () => {
    const data = {
      name: "John",
      email: "john@example.com",
      password: "password123"
    };

    const result = updateUserSchema.safeParse(data);

    expect(result.success).toBe(true);
  })
})