import request from "supertest";
import app from "@/app";

describe("Candidate Profile - Integration", () => {
  describe("Candidate Profile - getMe", () => {
    // 401 → No token
    it("should return 401 for profile without valid token", async () => {
      const response = await request(app)
        .get("/api/v1/candidates/me")
        .set("Authorization", `Bearer `);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    // 403 → Recruiter token
    it("should return 403 for recruiter's token", async () => {
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
        .get("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    // 200 → Valid candidate
    it("should return candidate profile for valid token", async () => {
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
        .get("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  })

  describe("Candidate Profile - updateMe", () => {
    // 401 no token
    it("should return 401 for profile without valid token", async () => {
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
        currentSector: "IT",
        experienceMonths: 24,
        qualification: "GRADUATE",
        briefIntro: "A software engineer",
        resumeUrl: "https://resume.com/resume.pdf",
        linkedinUrl: "https://linkedin.com/test",
        githubUrl: "https://github.com/test",
        portfolioUrl: "https://portfolio.com/",
      }

      const response = await request(app)
        .patch("/api/v1/candidates/me")
        .set("Authorization", `Bearer `)
        .send(profileUpdate);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    // 403 wrong role
    it("should return 403 for recruiter's token", async () => {
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
        currentSector: "IT",
        experienceMonths: 24,
        qualification: "GRADUATE",
        briefIntro: "A software engineer",
        resumeUrl: "https://resume.com/resume.pdf",
        linkedinUrl: "https://linkedin.com/test",
        githubUrl: "https://github.com/test",
        portfolioUrl: "https://portfolio.com/",
      }

      const response = await request(app)
        .patch("/api/v1/candidates/me")
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
        .post("/api/v1/auth/signup/candidate")
        .send(payload)

      expect(signup.status).toBe(201);

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        currentSector: "IT",
        experienceMonths: 24,
        qualification: "GRADUATE",
        briefIntro: "A software engineer",
        resumeUrl: "https://resume.com/resume.pdf",
        linkedinUrl: "https://linkedin.com/test",
        githubUrl: "https://github.com/test",
        portfolioUrl: "https://portfolio.com/",
      }

      const response = await request(app)
        .patch("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${token}`)
        .send(profileUpdate);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      console.log(response.body.data);
    });

    // 200 partial update
    it("should return 200 with updated profile for a valid token and partial update", async () => {
      const payload = {
        name: "John",
        email: `john${Date.now()}@example.com`,
        password: "Password123!"
      }

      const signup = await request(app)
        .post("/api/v1/auth/signup/candidate")
        .send(payload)

      const token = signup.body.data.accessToken;

      const partialProfileUpdate = {
        currentSector: "IT",
        experienceMonths: 24,
        qualification: "GRADUATE",
        briefIntro: "A software engineer"
      }

      const response = await request(app)
        .patch("/api/v1/candidates/me")
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
        .post("/api/v1/auth/signup/candidate")
        .send(payload)

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        id: "1",
        currentSector: "IT",
        experienceMonths: 24,
        qualification: "GRADUATE",
        briefIntro: "A software engineer",
        resumeUrl: "https://resume.com/resume.pdf",
        linkedinUrl: "https://linkedin.com/test",
        githubUrl: "https://github.com/test",
        portfolioUrl: "https://portfolio.com/",
      }

      const response = await request(app)
        .patch("/api/v1/candidates/me")
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
        .post("/api/v1/auth/signup/candidate")
        .send(payload)

      const token = signup.body.data.accessToken;

      const profileUpdate = {
        currentSector: "IT",
        experienceMonths: 24,
        qualification: "GRADUATE",
        briefIntro: "A software engineer",
        resumeUrl: "https://resume.com/resume.pdf",
        linkedinUrl: "https://linkedin.com/test",
        githubUrl: "https://github.com/test",
        portfolioUrl: "https://portfolio.com/",
      }

      const response = await request(app)
        .patch("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "text/plain")
        .send("invalid-body");

      expect(response.status).toBe(415);
      expect(response.body.success).toBe(false);
    });
  })
})