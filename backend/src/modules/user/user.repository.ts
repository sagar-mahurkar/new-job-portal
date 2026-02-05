import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config"
import { User } from "./user.entity"

export const userRepository: Repository<User> = JobPortalDataSource.getRepository(User);
