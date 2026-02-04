import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserRole } from "@/common/enums"
// import { Candidate, Recruiter } from "@/modules/recruiter/recruiter.entity.ts"

@Entity({ name: "users", synchronize: true })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ 
    type: "enum",
    enum: UserRole,
    enumName: "user_role_enum"
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  loginOtp?: string;

  @Column({ type: "timestamptz", nullable: true })
  loginOtpExpriresAt?: Date;

  // @Column({ nullable: true })
  // emailVerificationOtp: string; // (later)

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  // // one to one relationship
  // @OneToOne(() => Recruiter, (recruiter) => recruiter.user)
  // recruiter: Recruiter;

  // // one to one relationship
  // @OneToOne(() => Candidate, (candidate) => candidate.user)
  // candidate: Candidate;
}