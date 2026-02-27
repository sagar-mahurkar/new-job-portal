import { 
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { APPLICATION_STATUSES, ApplicationStatus } from "@/common/enums"

import { Candidate } from "@/modules/candidate/candidate.entity"
import { Job } from "../job/job.entity";

@Entity({name: "applications", synchronize: false})
@Index(["jobPostingId", "candidateId"], { unique: true })
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type: "enum", enum: APPLICATION_STATUSES, default: "APPLIED" as ApplicationStatus})
  status: ApplicationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ type: "uuid" })
  jobPostingId: string;

  @ManyToOne(() => Job, (job) => job.applications, {onDelete: "CASCADE"})
  @JoinColumn({name: "jobPostingId"})
  jobPosting: Job;

  @Column({ type: "uuid" })
  candidateId: string;
  
  @ManyToOne(() => Candidate, (candidate) => candidate.applications, {onDelete: "CASCADE"})
  @JoinColumn({name: "candidateId"})
  candidate: Candidate;
}