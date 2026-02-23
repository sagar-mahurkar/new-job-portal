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

jest.mock("@/modules/recruiter/recruiter.service");

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */

import { RecruiterController } from "@/modules/recruiter/recruiter.controller";
import { RecruiterService } from "@/modules/recruiter/recruiter.service";
import { CompanySector} from "@/common/enums";

const mockedRecruiterService = RecruiterService as jest.MockedClass<typeof RecruiterService>;

describe("RecruiterService.getMe", () => {
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

  it("should return 200 with Recruiter's updated profile", async () => {
    const mockRecruiterProfile: any = {
      userId: "1",
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockedRecruiterService.prototype.updateMe.mockResolvedValue(mockRecruiterProfile);

    req.body = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company",
    }

    await RecruiterController.updateMe(req, res, next);

    expect(mockedRecruiterService.prototype.updateMe).toHaveBeenCalledWith("1", req.body);
    expect(res.status).toHaveBeenCalledWith(200);

    const jsonResponse = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.data).toEqual({
      userId: "1",
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company",
    })
    expect(jsonResponse.message).toBe("Recruiter profile updated successfully");
    expect(jsonResponse.data).not.toHaveProperty("password");
    expect(jsonResponse.data).not.toHaveProperty("loginOtp");
    expect(jsonResponse.data).not.toHaveProperty("createdAt");
    expect(jsonResponse.data).not.toHaveProperty("updatedAt");
    expect(next).not.toHaveBeenCalled();
  })

  it("should call next on service error", async () => {
    const error = new Error("fail");

    mockedRecruiterService.prototype.updateMe
      .mockRejectedValue(error);

    req.body = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT" as CompanySector,
      description: "A software company",
    }
    
    await RecruiterController.updateMe(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});