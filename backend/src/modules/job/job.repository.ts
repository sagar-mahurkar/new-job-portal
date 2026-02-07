import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Job } from "./job.entity";

export const jobRepository: Repository<Job> = JobPortalDataSource.getRepository(Job);
