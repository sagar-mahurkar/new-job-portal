import { JobPortalDataSource } from "@/config/database.config";
import { AuthService } from "@/modules/auth/auth.service";
import request from "supertest";
import app from "@/app";

jest.spyOn(
  AuthService.prototype as any,
  "sendOtpEmail"
).mockResolvedValue(undefined);

describe("Auth Integration : Request OTP", () => {
  // success 200
  it("should generate OTP successfully", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    const response = await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // verify OTP stored in DB
    const userRepo = JobPortalDataSource.getRepository("User");

    const user = await userRepo.findOne({
      where: { email: payload.email }
    });

    expect(user?.loginOtp).toBeDefined();
    expect(user?.loginOtpExpiresAt).toBeDefined();
  });

  // Non-existent email (silent success)
  it("should return 200 even for non-existent email", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    const response = await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // verify OTP stored in DB
    const userRepo = JobPortalDataSource.getRepository("User");

    const user = await userRepo.findOne({
      where: { email: payload.email }
    });

    expect(user?.loginOtp).not.toBeDefined();
    expect(user?.loginOtpExpiresAt).not.toBeDefined();
  })

  // Inactive user (silent success)
  it("should return 200 even for inactive user", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // verify OTP stored in DB
    const userRepo = JobPortalDataSource.getRepository("User");

    const user = await userRepo.findOne({
      where: { email: payload.email }
    });

    user.isActive = false;

    const response = await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(user?.loginOtp).toBeNull();
    expect(user?.loginOtpExpiresAt).toBeNull();
  })

  // Invalid body (400)
  it("should return 400 for invalid body", async () => {
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    };

    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    const response = await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: "invalid-email" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  })

})