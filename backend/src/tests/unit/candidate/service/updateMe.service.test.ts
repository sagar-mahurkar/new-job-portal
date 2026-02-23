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
    findOne: jest.fn(),
    save: jest.fn()
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

describe("candidateService.updateMe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  // candidate profile not found -> 401
  it("should fail for candidate profile not found", async () => {
    (candidateRepository.findOne as jest.Mock).mockResolvedValue(null);

    const updatedCandidateProfile = {
      currentSector: "IT" as CompanySector,
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf",
      linkedinUrl: "https://linkedin.com/test",
      githubUrl: "https://github.com/test",
      portfolioUrl: "https://portfolio.com/",
    }

    await expect(candidateService.updateMe(
      "1", 
      updatedCandidateProfile
    )).rejects.toMatchObject({
      statusCode: 404
    });

    expect(candidateRepository.findOne).toHaveBeenCalledTimes(1);
    expect(candidateRepository.save).not.toHaveBeenCalled();
  })

  // valid update -> 200 -> success path
  it("should successfully update and return candidate profile", async () => {
    const mockedCandidateProfile = {
      currentSector: "IT" as CompanySector,
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf",
      linkedinUrl: "https://linkedin.com/test",
      githubUrl: "https://github.com/test",
      portfolioUrl: "https://portfolio.com/",
    };

    (candidateRepository.findOne as jest.Mock).mockResolvedValue(mockedCandidateProfile);
    (candidateRepository.save as jest.Mock).mockImplementation(
      (entity) => Promise.resolve(entity)
    );
    const updatedCandidateProfile = {
      experienceMonths: 36,
      qualification: "POST_GRADUATE" as CandidateQualification,
    }

    const result = await candidateService.updateMe("1", updatedCandidateProfile);
    
    expect(candidateRepository.findOne).toHaveBeenCalledTimes(1);
    expect(candidateRepository.findOne).toHaveBeenCalledWith({
      where: {userId: "1"}
    });
    
    expect(candidateRepository.save).toHaveBeenCalledTimes(1);
    expect(candidateRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      experienceMonths: 36,
      qualification: "POST_GRADUATE"
    }))
    expect(result.experienceMonths).toBe(36);
    expect(result.qualification).toBe("POST_GRADUATE");
  })

  // same value update -> 200 -> success path
    it("should successfully update even if it is same value update and return candidate profile", async () => {
    const mockedCandidateProfile = {
      currentSector: "IT" as CompanySector,
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf",
      linkedinUrl: "https://linkedin.com/test",
      githubUrl: "https://github.com/test",
      portfolioUrl: "https://portfolio.com/",
    };

    (candidateRepository.findOne as jest.Mock).mockResolvedValue(mockedCandidateProfile);
    (candidateRepository.save as jest.Mock).mockImplementation(
      (entity) => Promise.resolve(entity)
    );
    const updatedCandidateProfile = {
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
    }

    const result = await candidateService.updateMe("1", updatedCandidateProfile);
    
    expect(candidateRepository.findOne).toHaveBeenCalledTimes(1);
    expect(candidateRepository.findOne).toHaveBeenCalledWith({
      where: {userId: "1"}
    });
    
    expect(candidateRepository.save).toHaveBeenCalledTimes(1);
    expect(candidateRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      experienceMonths: 24,
      qualification: "GRADUATE"
    }))
    expect(result.experienceMonths).toBe(24);
    expect(result.qualification).toBe("GRADUATE");
  })
})