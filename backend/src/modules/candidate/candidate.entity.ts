import {
  Entity,
  Column, 
  OneToOne, 
  JoinColumn,
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

import { CandidateQualification, CompanySector } from "@/common/enums";
import { User } from "@/modules/user/user.entity";

@Entity({ name: "candidates", synchronize: true})
export class Candidate {
  @PrimaryColumn()
  userId: string;

  // one to one relationship
  @OneToOne(() => User, (user => user.candidate), {onDelete: "CASCADE"})
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "enum", enum: CompanySector, nullable: true })
  currentSector?: CompanySector;

  @Column({ nullable: true })
  experienceMonths?: number;

  @Column({ type: "enum", enum: CandidateQualification, nullable: true })
  qualification?: CandidateQualification;

  @Column({ nullable: true, length: 500 })
  briefIntro?: string;

  @Column({ nullable: true })
  resumeUrl?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column({ nullable: true })
  githubUrl?: string;

  @Column({ nullable: true })
  portfolioUrl?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz"})
  updatedAt: Date;
}