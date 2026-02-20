import { updateCandidateProfileSchema } from "@/modules/candidate/candidate.dto";

describe("updateCandidateProfileSchema", () => {
  // unknown field provided
  it("should fail for unknown field provided", async () => {
    const data = {
      userId: "1",
      currentSector: "IT"
    };

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // company sector is not in enum
  it("should fail for company sector not in enum", async () => {
    const data = {
      companySector: "INFRASTRUCTURE"
    };

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // negative experience value
  it("should fail for negative experience value", async () => {
    const data = {
      experienceMonths: -24
    };

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // negative or non-integer experience value
  it("should fail for non-integer experience value", async () => {
    const data = {
      experienceMonths: 1.5
    };

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // candidate qualification is not in enum
  it("should fail for candidate qualification is not in enum", async () => {
    const data = {
      qualification: "SSC"
    };

    const reuslt = updateCandidateProfileSchema.safeParse(data);

    expect(reuslt.success).toBe(false);
  })

  // invalid brief intro (char < 10)
  it("should fail for invalid brief intro with char less than 10", async () => {
    const data = {
      briefIntro: "invalid"
    };

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // invalid brief intro (char > 500)
  it("should fail for invalid brief intro with char more than 500", async () => {
    const data = {
      briefIntro: "I am a highly motivated backend-focused software \
      developer with hands-on experience building scalable APIs \
      using Node.js, Express, and TypeScript. Over the past few \
      years, I have worked extensively with relational databases, \
      implemented authentication systems using JWT and OTP flows, \
      and written comprehensive unit and integration tests t\
      o ensure production-grade reliability. \
      I enjoy designing clean service-layer architectures, \
      enforcing strict validation rules, and implementing \
      security hardening techniques to prevent common \
      vulnerabilities such as mass assignment and \
      privilege escalation. My focus is on writing maintainable, \
      testable, and deterministic code that aligns with industry \
      best practices and real-world deployment standards."
    }

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // missing fields (all field empty)
  it("should fail if all fields are missing", async () => {
    const data = {};

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(false);
  })

  // happy-path
  it("should safely validate the profile update", async () => {
    const data = {
      currentSector: "IT",
      experienceMonths: 24,
      qualification: "GRADUATE",
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf",
      linkedinUrl: "https://linkedin.com/test",
      githubUrl: "https://github.com/test",
      portfolioUrl: "https://portfolio.com/",
    };

    const result = updateCandidateProfileSchema.safeParse(data);

    expect(result.success).toBe(true);
  })
})