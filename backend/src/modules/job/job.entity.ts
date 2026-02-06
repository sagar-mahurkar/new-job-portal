import { 
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CandidateQualification, CompanySector, JobStatus } from "@/common/enums"
import { Recruiter } from "@/modules/recruiter/recruiter.entity"

@Entity({ name: "jobs", synchronize: true})
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "enum", enum: CandidateQualification})
  minQualification: CandidateQualification;

  @Column({ type: "enum", enum: CompanySector})
  jobSector: CompanySector;

  @Column({ type: "enum", enum: JobStatus, default: JobStatus.OPEN})
  status: JobStatus;

  @Column({ type: "int" })
  vacancies: number;

  @Column({ default: 0 })
  applicantCount: number;

  @CreateDateColumn({ type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz"})
  updatedAt: Date;

  // many to one relationship
  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobPostings, {onDelete: "CASCADE"})
  @JoinColumn({ name: "recruiterId"})
  recruiter: Recruiter;

  @Column()
  recruiterId: string;
}