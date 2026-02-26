import { 
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { 
  CANDIDATE_QUALIFICATIONS,
  COMPANY_SECTORS, 
  JOB_STATUSES,
  CandidateQualification, 
  CompanySector, 
  JobStatus 
} from "@/common/enums"
import { Recruiter } from "@/modules/recruiter/recruiter.entity"
import { Application } from "../application/application.entity";

@Entity({ name: "jobs", synchronize: true})
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "enum", enum: CANDIDATE_QUALIFICATIONS})
  minQualification: CandidateQualification;

  @Column({ type: "enum", enum: COMPANY_SECTORS})
  jobSector: CompanySector;

  @Column({ type: "enum", enum: JOB_STATUSES, default: "OPEN"})
  status: JobStatus;

  @Column({ type: "int" })
  vacancies: number;

  @Column({ default: 0 })
  applicantCount: number;

  @CreateDateColumn({ type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz"})
  updatedAt: Date;

  @Column({ type: "uuid" })
  recruiterId: string;

  // many to one relationship
  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobPostings, {onDelete: "CASCADE"})
  @JoinColumn({ name: "recruiterId"})
  recruiter: Recruiter;

  // one to many relationship
  @OneToMany(() => Application, (application) => application.jobPosting)
  applications: Application[];
}