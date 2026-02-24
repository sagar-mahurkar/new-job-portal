import request from "supertest";
import app from "@/app";
import { AuthService } from "@/modules/auth/auth.service";
import { userRepository } from "@/modules/user/user.repository";

describe("Auth Integration - Login OTP", () => {
  beforeAll(() => {
    jest
      .spyOn(AuthService.prototype as any, "sendOtpEmail")
      .mockResolvedValue(undefined);

    jest
      .spyOn(AuthService.prototype as any, "generateLoginOtp")
      .mockReturnValue("123456");
  });

  // Success
  it("should return user + token for valid user login with OTP", async () => {
    // payload
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    }

    // signup
    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // request otp
    await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email })

    // verify otp
    const response = await request(app)
      .post("/api/v1/auth/login/otp/verify")
      .send({
        email: payload.email,
        loginOtp: "123456"
      })

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user).toMatchObject(expect.objectContaining({
      name: payload.name,
      email: payload.email
    }));
    expect(response.body.data.accessToken).toBeDefined();
  })
  
  // Invalid OTP
  it("should return 401 for invalid login OTP", async () => {
    // payload
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    }

    // signup
    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // request otp
    await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email })

    // verify otp
    const response = await request(app)
      .post("/api/v1/auth/login/otp/verify")
      .send({
        email: payload.email,
        loginOtp: "123568"
      })

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  })
  
  // Expired OTP
  it("should return 401 for expired login OTP", async () => {
    // payload
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    }

    // signup
    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // request otp
    await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email })

    const user = await userRepository.findOne({
      where: {email: payload.email}
    })

    user.loginOtpExpiresAt = new Date(Date.now() - 1000);
    
    await userRepository.save(user);

    // verify otp
    const response = await request(app)
      .post("/api/v1/auth/login/otp/verify")
      .send({
        email: payload.email,
        loginOtp: "123456"
      })

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  })
  
  // Missing OTP
  it("should return 400 for missing login OTP", async () => {
    // payload
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    }

    // signup
    await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send(payload);

    // request otp
    await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email })

    // verify otp
    const response = await request(app)
      .post("/api/v1/auth/login/otp/verify")
      .send({
        email: payload.email,
      })

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  })
  
  // Non-existent user
  it("should return 401 for non existing user", async () => {
    // payload
    const payload = {
      name: "John",
      email: "john@test.com",
      password: "Password123!"
    }

    // request otp
    await request(app)
      .post("/api/v1/auth/login/otp/request")
      .send({ email: payload.email })

    // verify otp
    const response = await request(app)
      .post("/api/v1/auth/login/otp/verify")
      .send({
        email: payload.email,
        loginOtp: "123456"
      })

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  })
})