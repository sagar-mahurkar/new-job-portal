import request from "supertest";
import app from "@/app";
import { JobPortalDataSource } from "@/config/database.config";

describe("Auth Integration - Login Password", () => {
  it("should successfully login and return user profile and token", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    // Signup first
    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // Login
    const response = await request(app)
      .post("/api/v1/auth/login/password")
      .send({
        email: payload.email,
        password: payload.password
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("accessToken");

    expect(response.body.data.user).toMatchObject({
      email: payload.email,
      role: "RECRUITER"
    });

    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.body.data.user).not.toHaveProperty("loginOtp");
    expect(response.body.data.user).not.toHaveProperty("loginOtpExpiresAt");
  });

  it("should  reject the login for the incorrect password", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    // Signup first
    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // Login
    const response = await request(app)
      .post("/api/v1/auth/login/password")
      .send({
        email: payload.email,
        password: "Password123"
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should  reject the login for the non existing email", async () => {
    const payload = {
      email: "john@test.com",
      password: "Password123!"
    };

    // Login
    const response = await request(app)
      .post("/api/v1/auth/login/password")
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return 400 for invalid body", async () => {
    const payload = {
      email: "invalid-email",
      password: "Password123!"
    };

    // Login
    const response = await request(app)
      .post("/api/v1/auth/login/password")
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return 403 if user is inactive", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // deactivate directly in DB
    const userRepo = JobPortalDataSource.getRepository("User");

    const user = await userRepo.findOne({
      where: { email: payload.email }
    });

    user.isActive = false;
    await userRepo.save(user);

    const response = await request(app)
      .post("/api/v1/auth/login/password")
      .send({
        email: payload.email,
        password: payload.password
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
})