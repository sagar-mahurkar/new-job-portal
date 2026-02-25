import request from "supertest";
import app from "@/app";

describe("Recruiter Profile - Integration", () => {
  describe("Recruiter Profile - getMe", () => {
    // 401 → No token
    it("should return 401 for profile without valid token", async () => {
      const response = await request(app)
        .get("/api/v1/recruiters/me")
        .set("Authorization", `Bearer `);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    // 403 → Recruiter token
    it("should return 403 for candidate's token", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@test.com`,
        password: "Password123!"
      };

      const signup = await request(app)
        .post("/api/v1/auth/signup/candidate")
        .send(payload);

      const token = signup.body.data.accessToken;

      const response = await request(app)
        .get("/api/v1/recruiters/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    // 200 → Valid candidate
    it("should return recruiter profile for valid token", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@test.com`,
        password: "Password123!"
      };

      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload);

      const token = signup.body.data.accessToken;

      const response = await request(app)
        .get("/api/v1/recruiters/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  })

  describe("Recruiter Profile - updateMe", () => {
    // 401 no token
    it("should return 401 for profile without valid token", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@example.com`,
        password: "Password123!"
      }

      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        companyName: "ABC Pvt. Ltd.",
        companySector: "IT",
        description: "A software company"
      }

      const response = await request(app)
        .patch("/api/v1/recruiters/me")
        .set("Authorization", `Bearer `)
        .send(profileUpdate);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    // 403 wrong role
    it("should return 403 for candidate's token", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@example.com`,
        password: "Password123!"
      }

      const signup = await request(app)
        .post("/api/v1/auth/signup/candidate")
        .send(payload)

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        companyName: "ABC Pvt. Ltd.",
        companySector: "IT",
        description: "A software company"
      }

      const response = await request(app)
        .patch("/api/v1/recruiters/me")
        .set("Authorization", `Bearer ${token}`)
        .send(profileUpdate);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    // 200 success
    it("should return 200 with updated profile for a valid token and update", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@example.com`,
        password: "Password123!"
      }

      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        companyName: "ABC Pvt. Ltd.",
        companySector: "IT",
        description: "A software company"
      }

      const response = await request(app)
        .patch("/api/v1/recruiters/me")
        .set("Authorization", `Bearer ${token}`)
        .send(profileUpdate);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(expect.objectContaining(profileUpdate));
    });

    // 200 partial update
    it("should return 200 with updated profile for a valid token and partial update", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@example.com`,
        password: "Password123!"
      }

      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)

      const token = signup.body.data.accessToken;

      const partialProfileUpdate = {
        companyName: "XYZ Pvt. Ltd.",
      }

      const response = await request(app)
        .patch("/api/v1/recruiters/me")
        .set("Authorization", `Bearer ${token}`)
        .send(partialProfileUpdate);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    // 400 invalid DTO -> extra field is passed
    it("should return 400 for invalid dto", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@example.com`,
        password: "Password123!"
      }

      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        id: "1",
        companyName: "ABC Pvt. Ltd.",
        companySector: "IT",
        description: "A software company"
      }

      const response = await request(app)
        .patch("/api/v1/recruiters/me")
        .set("Authorization", `Bearer ${token}`)
        .send(profileUpdate);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    // 415 unsupported content type
    it("should return 415 for unsupported content type", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@example.com`,
        password: "Password123!"
      }

      const signup = await request(app)
        .post("/api/v1/auth/signup/recruiter")
        .send(payload)

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        companyName: "ABC Pvt. Ltd.",
        companySector: "IT",
        description: "A software company"
      }

      const response = await request(app)
        .patch("/api/v1/recruiters/me")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "text/plain")
        .send("invalid-body");

      expect(response.status).toBe(415);
      expect(response.body.success).toBe(false);
    });
  })
})