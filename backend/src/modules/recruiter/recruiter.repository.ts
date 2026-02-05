import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Recruiter } from "./recruiter.entity";

export const recruiterRepository: Repository<Recruiter> = JobPortalDataSource.getRepository(Recruiter);
