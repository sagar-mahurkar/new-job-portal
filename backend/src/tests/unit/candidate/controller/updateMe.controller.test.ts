/**
 * --------------------------------------------------------------------
 * MOCKS (TOP)
 * --------------------------------------------------------------------
 */

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
}));

jest.mock("@/modules/candidate/candidate.service");

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */

import { CandidateController } from "@/modules/candidate/candidate.controller";
import { CandidateService } from "@/modules/candidate/candidate.service";
import { CompanySector, CandidateQualification } from "@/common/enums";

const mockedCandidateService = CandidateService as jest.MockedClass<typeof CandidateService>;

describe("CandidateController.updateMe", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      user: { id: "1" }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it("should return 200 with Candidate's updated profile", async () => {
    const mockCandidateProfile: any = {
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
      updatedAt: new Date(),
    }

    mockedCandidateService.prototype.updateMe.mockResolvedValue(mockCandidateProfile);

    req.body = {
      currentSector: "IT" as CompanySector,
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf"
    }

    await CandidateController.updateMe(req, res, next);

    expect(mockedCandidateService.prototype.updateMe).toHaveBeenCalledWith("1", req.body);
    expect(res.status).toHaveBeenCalledWith(200);

    const jsonResponse = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.data).toEqual({
      userId: "1",
      currentSector: "IT" as CompanySector,
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf",
      linkedinUrl: "https://linkedin.com/test",
      githubUrl: "https://github.com/test",
      portfolioUrl: "https://portfolio.com/",
    })
    expect(jsonResponse.message).toBe("Candidate profile updated successfully");
    expect(jsonResponse.data).not.toHaveProperty("password");
    expect(jsonResponse.data).not.toHaveProperty("loginOtp");
    expect(jsonResponse.data).not.toHaveProperty("createdAt");
    expect(jsonResponse.data).not.toHaveProperty("updatedAt");
    expect(next).not.toHaveBeenCalled();
  })

  it("should call next on service error", async () => {
    const error = new Error("fail");

    mockedCandidateService.prototype.updateMe
      .mockRejectedValue(error);

    req.body = {
      currentSector: "IT" as CompanySector,
      experienceMonths: 24,
      qualification: "GRADUATE" as CandidateQualification,
      briefIntro: "Backend developer",
      resumeUrl: "https://resume.com/resume.pdf"
    }
    
    await CandidateController.updateMe(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});