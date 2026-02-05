import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Candidate } from "./candidate.entity";

export const candidateRepository: Repository<Candidate> = JobPortalDataSource.getRepository(Candidate);
