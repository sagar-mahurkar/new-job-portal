import request from "supertest";
import app from "@/app";

describe("Auth Integration - Signup Recruiter", () => {
  it("should create recruiter successfully", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    const response = await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.email).toBe("john@test.com");
  });

  it("should return 409 for duplicate email", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    // First signup
    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // Second signup with same email
    const response = await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should return 400 for invalid body", async () => {
    const payload = {
      name: "John",
      email: "invalid-email",
      password: "Password123!"
    };

    const response = await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return 415 for unsupported content-type", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .set("Content-Type", "text/plain")
      .send("invalid");

    expect(response.status).toBe(415);
  });

  it("should return 400 for malformed JSON", async () => {
    const payload = {
      email: "invalid-email",
      password: "Password123!",
    }
    const response = await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .set("Content-Type", "application/json")
      .send(payload); // broken JSON

    expect(response.status).toBe(400);
  });
});