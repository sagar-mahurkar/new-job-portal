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
    findOne: jest.fn(),
    save: jest.fn()
  }
}))

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
*/
import { recruiterRepository } from "@/modules/recruiter/recruiter.repository";
import { RecruiterService } from "@/modules/recruiter/recruiter.service";
import { CompanySector } from "@/common/enums";

const recruiterService = new RecruiterService();

describe("recruiterService.updateMe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  // recruiter profile not found -> 404
  it("should fail for recruiter profile not found", async () => {
    (recruiterRepository.findOne as jest.Mock).mockResolvedValue(null);

    const updatedRecruiterProfile = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company"
    };

    await expect(recruiterService.updateMe(
      "1", updatedRecruiterProfile
    )).rejects.toMatchObject({
      statusCode: 404
    });

    expect(recruiterRepository.findOne).toHaveBeenCalledTimes(1);
    expect(recruiterRepository.findOne).toHaveBeenCalledWith({
      where: { userId: "1" }
    })
    expect(recruiterRepository.save).not.toHaveBeenCalled();
  })

  // happy-path -> 200
  it("should successfully update and return recruiter profile", async () => {
    const recruiterProfile = {
      userId: "1",
      companyName: "ABC Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software"
    };

    (recruiterRepository.findOne as jest.Mock).mockResolvedValue(recruiterProfile);

    const updatedRecruiterProfile = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company"
    };

    const result = await recruiterService.updateMe("1", updatedRecruiterProfile);

    expect(result).toMatchObject({userId: "1", ...updatedRecruiterProfile});

    expect(recruiterRepository.findOne).toHaveBeenCalledTimes(1);
    expect(recruiterRepository.findOne).toHaveBeenCalledWith({
      where: { userId: "1" }
    });

    expect(recruiterRepository.save).toHaveBeenCalledTimes(1);
    expect(recruiterRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      companyName: "XYZ Pvt. Ltd.",
      description: "A software company"
    }));

    expect(result.companyName).toBe("XYZ Pvt. Ltd.");
    expect(result.description).toBe("A software company");
  })

  // same value update -> 200
  it("should successfully update even for same values and return recruiter profile", async () => {
    const recruiterProfile = {
      userId: "1",
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company"
    };

    (recruiterRepository.findOne as jest.Mock).mockResolvedValue(recruiterProfile);

    const updatedRecruiterProfile = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company"
    };

    const result = await recruiterService.updateMe("1", updatedRecruiterProfile);

    expect(result).toMatchObject({userId: "1", ...updatedRecruiterProfile});

    expect(recruiterRepository.findOne).toHaveBeenCalledTimes(1);
    expect(recruiterRepository.findOne).toHaveBeenCalledWith({
      where: { userId: "1" }
    });

    expect(recruiterRepository.save).toHaveBeenCalledTimes(1);
    expect(recruiterRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      companyName: "XYZ Pvt. Ltd.",
      description: "A software company"
    }));

    expect(result.companyName).toBe("XYZ Pvt. Ltd.");
    expect(result.description).toBe("A software company");
  })
})