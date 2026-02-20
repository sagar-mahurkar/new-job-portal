/**
 * --------------------------------------------------------------------
 * MOCKS (TOP)
 * --------------------------------------------------------------------
 */

// env.config
jest.mock("@/config/env.config", () => ({
  env: {
    NODE_ENV: "test",
    POSTGRES_HOST: "0.0.0.0",
    POSTGRES_PORT: 5432,
    POSTGRES_USERNAME: "test",
    POSTGRES_PASSWORD: "test",
    POSTGRES_DATABASE: "test",
    PORT: 3000,
    JWT_SECRET: "testsecret123",
  }
}))

// candidateRepository
jest.mock("@/modules/candidate/candidate.repository", () => ({
  candidateRepository: {
    findOne: jest.fn()
  }
}))

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */

import { candidateRepository } from "@/modules/candidate/candidate.repository";
import { CandidateService } from "@/modules/candidate/candidate.service";
import { CandidateQualification, CompanySector } from "@/common/enums";

const candidateService = new CandidateService();

describe("candidateService.getMe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })
  // candidate profile not found
  it("should fail if the candidate profile is not found", async () => {
    (candidateRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(candidateService.getMe("1")).rejects.toMatchObject({
      statusCode: 404
    });

    expect(candidateRepository.findOne).toHaveBeenCalledTimes(1);
    expect(candidateRepository.findOne).toHaveBeenCalledWith({ 
      where: { "userId": "1"}
    });
  })

  // success path
  it("should return candidate profile for valid candidate", async () => {
    const mockCandidate = {
      userId: "1",
      currentSector: "IT" as CompanySector,
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf",
      linkedinUrl: "https://linkedin.com/test",
      githubUrl: "https://github.com/test",
      portfolioUrl: "https://portfolio.com/",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (candidateRepository.findOne as jest.Mock).mockResolvedValue(mockCandidate);

    const result = await candidateService.getMe("1");

    expect(result).toMatchObject(mockCandidate);

    expect(candidateRepository.findOne).toHaveBeenCalledTimes(1);
    expect(candidateRepository.findOne).toHaveBeenCalledWith({
      where: {userId: "1"}
    });

    expect(result).not.toHaveProperty("password");
    expect(result).not.toHaveProperty("otp");
  })
})