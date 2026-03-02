import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Job } from "../job/job.entity";
import { CompanySector, ExperienceLevel, JOB_STATUSES } from "@/common/enums";

export const jobRepo: Repository<Job> = JobPortalDataSource.getRepository(Job);

export const publicJobRepository = {
  findOpenJobsWithFilters: async (
    search?: string, 
    sector?: CompanySector, 
    location?: string, 
    experienceLevel?: ExperienceLevel, 
    page: number = 1, 
    limit: number = 10
  ) => {
    const qb = jobRepo.createQueryBuilder("job")
      .leftJoin("job.recruiter", "recruiter")
      .select("job.id", "id")  
      .addSelect("job.title", "title")
      .addSelect("job.description", "description")
      .addSelect("job.jobSector", "sector")
      .addSelect("job.minQualification", "minQualification")
      .addSelect("job.location", "location")
      .addSelect("job.experienceLevel", "experienceLevel")
      .addSelect("recruiter.companyName", "companyName")
      .addSelect("job.createdAt", "createdAt")
      .where("job.status = :status", { status: JOB_STATUSES[0]})  // status = "OPEN"
    
    if (search) {
      qb.andWhere(
        "(job.title ILIKE :search OR job.description ILIKE :search)", 
        { search : `%${search}%`}
      )
    }

    if (sector) {
      qb.andWhere(
        "job.jobSector = :sector",
        { sector }
      )
    }

    if (location) {
      qb.andWhere(
        "job.location = :location",
        { location }
      )
    }

    if (experienceLevel) {
      qb.andWhere(
        "job.experienceLevel = :experienceLevel",
        { experienceLevel }
      )
    }

    qb.orderBy("job.createdAt", "DESC")
      .limit(limit)
      .offset((page - 1) * limit)

    const rows = await qb.getRawMany();
    const total = await qb.getCount();

    return { rows, total };
  },

  findOpenJobById: async (jobId: string) => {
    const job = jobRepo.createQueryBuilder("job")
      .leftJoin("job.recruiter", "recruiter")
      .select("job.id", "id")
      .addSelect("job.title", "title")
      .addSelect("job.description", "description")
      .addSelect("job.jobSector", "sector")
      .addSelect("job.minQualification", "minQualification")
      .addSelect("job.location", "location")
      .addSelect("job.experienceLevel", "experienceLevel")
      .addSelect("recruiter.companyName", "companyName")
      .addSelect("job.createdAt", "createdAt")
      .where("job.id = :jobId", { jobId })
      .andWhere("job.status = :status", { status: JOB_STATUSES[0]}) // status = "OPEN"
      .getRawOne()

    return job;
  },

  findPublicJobFilters: async () => {
    const [ locations, experienceLevels ] = await Promise.all([
      jobRepo.createQueryBuilder("job")
        .select("DISTINCT job.location", "location")
        .where("job.status = :status", { status: JOB_STATUSES[0] }) // status = "OPEN"
        .orderBy("job.location")
        .getRawMany()
      ,
      jobRepo.createQueryBuilder("job")
        .select("DISTINCT job.experienceLevel", "experienceLevel")
        .where("job.status = :status", { status: JOB_STATUSES[0]}) // status = "OPEN"
        .orderBy("job.experienceLevel")
        .getRawMany()
    ]);

    return { locations, experienceLevels };
  }
}
