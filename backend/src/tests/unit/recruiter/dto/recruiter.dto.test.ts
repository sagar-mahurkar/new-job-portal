import { updateRecruiterProfileSchema } from "@/modules/recruiter/dtos/recruiter.dto";

describe("updateRecruiterProfileSchema", () => {
  // extra field provided
  it("should fail for extra field provided", async () => {
    const data = {
      role: "CANDIDATE",
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT",
      description: "A software company"
    };

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(false)
  })

  // company sector is not in enum
  it("should fail for company sector not in enum", async () => {
    const data = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "INFRASTRUCTURE",
      description: "A construction company"
    };

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(false)
  })

  // invalid company name (char < 3)
  it("should fail for invalid company name, char less than 3", async () => {
    const data = {
      companyName: "XY",
      companySector: "IT",
      description: "A software company"
    }

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(false)
  })

  // boundary case: company name (char = 3)
  it("should pass for valid company name, with exactly 3 char", async () => {
    const data = {
      companyName: "XYZ",
      companySector: "IT",
      description: "A software company"
    }

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(true)
  })

  // invalid description (char < 10)
  it("should fail for invalid description, char less than 10", async () => {
    const data = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT",
      description: "A soft"
    };

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(false)
  })

  // boundary case: description (char = 10)
  it("should pass for valid description, with exactly 10 char", async () => {
    const data = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT",
      description: "A software"
    }

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(true)
  })

  // missing fields (all fields empty)
  it("should fail for all empty fields", async () => {
    const data = {};

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(false)
  })

  // happy-path
  it("should pass for valid update data", async () => {
    const data = {
      companyName: "XYZ Pvt. Ltd.",
      companySector: "IT",
      description: "A software company"
    }

    const result = updateRecruiterProfileSchema.safeParse(data);

    expect(result.success).toBe(true)
  })
})