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

// recruiter repository
jest.mock("@/modules/recruiter/recruiter.repository", () => ({
  recruiterRepository: {
    findOne: jest.fn()
  }
}))

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
*/

import { recruiterRepository } from "@/modules/recruiter/recruiter.repository";
import { RecruiterService } from "@/modules/recruiter/recruiter.service";
import { CandidateQualification, CompanySector, JobStatus } from "@/common/enums";
import { Job } from "@/modules/job/job.entity";

const recruiterService = new RecruiterService();

describe("recruiterService.getMe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  // recruiter profile not found
  it("should fail if the recruiter profile is not found", async () => {
    (recruiterRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(recruiterService.getMe("1")).rejects.toMatchObject({
      statusCode: 404
    })

    expect(recruiterRepository.findOne).toHaveBeenCalledTimes(1);
    expect(recruiterRepository.findOne).toHaveBeenCalledWith({
      where: { userId: "1" }
    })
  })

  // success path
  it("should return recruiter profile for valid recruiter", async () => {
    const job1 = Object.assign(new Job(), {
      id: "1",
      title: "Software Developer",
      description: "Software Developer with the knowledge of C++/Java",
      minQualification: "GRADUATE" as CandidateQualification,
      jobSector: "IT" as CompanySector,
      status: "OPEN" as JobStatus,
      vacancies: 1,
      applicantCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      recruiterId: "1"
    })
    const mockedRecruiter = {
      userId: "1",
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company",
      createdAt: new Date(),
      updatedAt: new Date(),
      jobPostings: [job1],
    };

    (recruiterRepository.findOne as jest.Mock).mockResolvedValue(mockedRecruiter);

    const result = await recruiterService.getMe("1");

    expect(result).toMatchObject(mockedRecruiter);
    
    expect(recruiterRepository.findOne).toHaveBeenCalledTimes(1);
    expect(recruiterRepository.findOne).toHaveBeenCalledWith({
      where: { userId: "1" }
    })

    expect(result).not.toHaveProperty("password");
    expect(result).not.toHaveProperty("otp");
  })
})