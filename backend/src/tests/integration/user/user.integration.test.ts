import request from "supertest";
import app from "@/app";

describe("User Profile - Integration", () => {
  // GET
  describe("User Profile - getMe", () => {
    // 401 → no token
    it("should return 401 for profile without valid token", async () => {
      const response = await request(app)
        .get("/api/v1/user/me")
        .set("Authorization", `Bearer `)

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    })
    
    // 200 → valid
    it("should return 200 for profile with valid token", async () => {
      const payload = {
        name: "John",
        email: "john@test.com",
        password: "Password123!"
      }
      // signup
      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)
      
      const token = signup.body.data.accessToken;

      const response = await request(app)
        .get("/api/v1/user/me")
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    })
  })
  
  // PATCH
  describe("User Profile - updateMe", () => {
    // 200 → valid update
    it("should return 200 for valid profile update with valid token", async () => {
      const payload = {
        name: "John",
        email: "john@test.com",
        password: "Password123!"
      }
      // signup
      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)
      
      const token = signup.body.data.accessToken;

      const profileUpdate = {
        email: "john@example.com"
      }

      const response = await request(app)
        .patch("/api/v1/user/me")
        .set("Authorization", `Bearer ${token}`)
        .send(profileUpdate)

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    })
    
    // 409 → duplicate email
    it("should return 409 for profile update with duplicate email", async () => {
      const payload1 = {
        name: "John",
        email: "john@test.com",
        password: "Password123!"
      }
      // signup
      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload1)

      const payload2 = {
        name: "John",
        email: "john@example.com",
        password: "Password123!"
      }
      // signup
      await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload2)
      
      const token = signup.body.data.accessToken;

      const profileUpdate = {
        email: "john@example.com"
      }

      const response = await request(app)
        .patch("/api/v1/user/me")
        .set("Authorization", `Bearer ${token}`)
        .send(profileUpdate)

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    })
    
    // 400 → invalid body
    it("should return 400 for profile update with invalid body", async () => {
      const payload = {
        name: "John",
        email: "john@test.com",
        password: "Password123!"
      }
      // signup
      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)
      
      const token = signup.body.data.accessToken;

      const profileUpdate = {
        email: "invalid-email"
      }

      const response = await request(app)
        .patch("/api/v1/user/me")
        .set("Authorization", `Bearer ${token}`)
        .send(profileUpdate)

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    })
  })
  
  // DELETE (Deactivate)
  describe("User Profile - deactivateMe", () => {
    // 200 → success
    it("should return 200 for successful profile deactivation", async () => {
      const payload = {
        name: "John",
        email: "john@test.com",
        password: "Password123!"
      }

      // signup
      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)
      
      const token = signup.body.data.accessToken;

      const response = await request(app)
        .delete("/api/v1/user/me")
        .set("Authorization", `Bearer ${token}`)
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User deactivated successfully");

      // Then login should fail (401 inactive)
      const login = await request(app)
        .post("/api/v1/auth/login/password")
        .send({
          email: payload.email,
          password: payload.password
        })
      
      expect(login.status).toBe(403);
    })
  })
})