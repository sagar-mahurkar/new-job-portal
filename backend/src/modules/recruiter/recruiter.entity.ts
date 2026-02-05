import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "@/modules/user/user.entity";
import { CompanySector } from "@/common/enums";

@Entity({ name: "recruiters", synchronize: true })
export class Recruiter {
  @PrimaryColumn()
  userId: string;
  
  // one to one relationship
  @OneToOne(() => User, (user) => user.recruiter, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ type: "enum", enum: CompanySector, nullable: true})
  companySector?: CompanySector;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}