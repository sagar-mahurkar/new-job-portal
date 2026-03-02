import { publicJobRepository } from "./public-job.repository";
import { JobIdParamDto, ListPublicJobsDto } from "./dtos"
import { AppError } from "@/common/errors/AppError";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class PublicJobService {
  async getOpenJobsWithFilters(dto: ListPublicJobsDto) {
    const { search, sector, location, experienceLevel, page, limit } = dto

    const { rows, total } = await publicJobRepository.findOpenJobsWithFilters(
      search, sector, location, experienceLevel, page, limit)

    const totalPages = Math.ceil(total/limit)

    return { rows, total, page, limit, totalPages}

  }

  async getOpenJobById(dto: JobIdParamDto) {
    const { id } = dto;

    const job = await publicJobRepository.findOpenJobById(id);

    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND);
    }

    return job;
  }

  async getPublicJobFilters() {
    const { locations, experienceLevels } = await publicJobRepository.findPublicJobFilters();
    return  {
      locations: locations.map(l => l.location),
      experienceLevels: experienceLevels.map(e => e.experienceLevel)
    };
  }
}
