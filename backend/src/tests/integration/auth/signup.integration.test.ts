import request from "supertest";
import app from "@/app";

describe("Auth Integration - Signup Recruiter", () => {
  it("should create recruiter successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup/recruiter")
      .send({
        name: "John",
        email: "john@test.com",
        password: "Password123!"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.email).toBe("john@test.com");
  });

});