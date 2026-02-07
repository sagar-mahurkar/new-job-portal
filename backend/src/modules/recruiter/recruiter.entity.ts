import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "@/modules/user/user.entity";
import { COMPANY_SECTORS, CompanySector } from "@/common/enums";
import { Job } from "@/modules/job/job.entity";
@Entity({ name: "recruiters", synchronize: false })
export class Recruiter {
  @PrimaryColumn("uuid")
  userId: string;
  
  // one to one relationship
  @OneToOne(() => User, (user) => user.recruiter, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ type: "enum", enum: COMPANY_SECTORS, nullable: true})
  companySector?: CompanySector;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  // one to many relationship
  @OneToMany(() => Job, (job) => job.recruiter, {cascade: true})
  jobPostings: Job;
}