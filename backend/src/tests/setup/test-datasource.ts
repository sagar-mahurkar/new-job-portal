import { DataSource } from "typeorm";
import { User } from "@/modules/user/user.entity";
import { Candidate } from "@/modules/candidate/candidate.entity";
import { Recruiter } from "@/modules/recruiter/recruiter.entity";
import { Job } from "@/modules/job/job.entity";

export const TestDataSource = new DataSource({
  type: "postgres",
  host: "0.0.0.0",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "job_portal_test",
  entities: [User, Candidate, Recruiter, Job],
  synchronize: true,
});