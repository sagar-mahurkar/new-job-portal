// auth.service.ts
import bcrypt from "bcrypt";
import { userRepository } from "@/modules/user/user.repository";
import { JobPortalDataSource } from "@/config/database.config";
import { UserRole } from "@/common/enums";
import { SignupRecruiterDto, SignupCandidateDto, LoginPasswordDto, LoginOtpDto, RequestOtpDto } from "./dtos";
import { AppError } from "@/common/errors/AppError";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { User } from "@/modules/user/user.entity"
import { Recruiter } from "@/modules/recruiter/recruiter.entity"
import { Candidate } from "../candidate/candidate.entity";
import { MailTransporter } from "@/config/mail.config";
import * as fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.config";
export class AuthService {
  private transporter = MailTransporter.getInstance();

  private htmlTemplatePath = path.join(process.cwd(), "src", "templates", "otp.html"); // path will change later
  
  // signupRecruiter()
  async signupRecruiter(dto: SignupRecruiterDto) {
    // 1. Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new AppError(
        "User with email already exists", 
        HttpStatusCodes.CONFLICT
      );
    };

    // 2. Hash the plain-text password
    const hashedPassword = await this.hashPasswordOrOtp(dto.password);

    const user = await JobPortalDataSource.transaction(async (manager) => {
      // 3. Create recruiter user entity
      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.RECRUITER,
        isActive: true,
      });
      // 4. Persist user in database
      await manager.save(user);

      // 5. create recruiter profile in same transaction
      const recruiter = manager.create(Recruiter, { user })
      await manager.save(recruiter);

      return user;
    })
 
    // 6. generate JWT for authenticated session
    const token = this.generateJwt(user.id, user.role);

    return { 
      user, 
      token
    }
  }

  // signupCandidate()
  async signupCandidate(dto: SignupCandidateDto) {
    // 1. Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new AppError(
        "User with email already exists", 
        HttpStatusCodes.CONFLICT
      );
    };

    // 2. Hash the plain-text password
    const hashedPassword = await this.hashPasswordOrOtp(dto.password);

    const user = await JobPortalDataSource.transaction(async (manager) => {
      // 3. Create candidate user entity
      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.CANDIDATE,
        isActive: true,
      });

      // 4. Persist user in database
      await manager.save(user);

      // 5. create candidate profile in same transaction
      const candidate = manager.create(Candidate, { user })
      await manager.save(candidate);

      return user;
    })

    // 6. generate JWT for authenticated session
    const token = this.generateJwt(user.id, user.role);

    return { 
      user, 
      token
    }
  }

  // loginWithPassword()
  async loginWithPassword(dto: LoginPasswordDto) {
    // 1. Fetch user by email
    const user = await userRepository.findOne({
      where: { email: dto.email },
    });

    // 2. Validate user existence and password-based login eligibility
    if (!user || !user.password) {
      throw new AppError(
        "Invalid email or password", 
        HttpStatusCodes.UNAUTHORIZED
      );
    };

    // 3. Ensure account is active
    if (!user.isActive) {
      throw new AppError(
        "Account is disabled", 
        HttpStatusCodes.FORBIDDEN
      );
    };

    // 4. Compare provided password with stored hash
    const isPasswordValid = await this.comparePasswordOrOtp(dto.password, user.password)

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password", 
        HttpStatusCodes.UNAUTHORIZED
      );
    };

    // 5. generate JWT for authenticated session
    const token = this.generateJwt(user.id, user.role);

    return { 
      user, 
      token
    }
  }

  // requestLoginOtp()
  async requestLoginOtp(dto: RequestOtpDto) {
    // 1. Fetch user by email
    const user = await userRepository.findOne({
      where: { email: dto.email },
    });

    // 2. Validate user existence and active status
    if (!user || !user.isActive) {
      return;    // ignore silently
    };

    // 3. Prevent resending OTP if existing OTP is still valid
    if (user.loginOtpExpiresAt && user.loginOtpExpiresAt > new Date()) {
      throw new AppError(
        "OTP has already been sent", 
        HttpStatusCodes.TOO_MANY_REQUESTS
      );
    };
    
    // 4. Generate one-time password (OTP)
    const otp = this.generateLoginOtp();

    // 5. Store OTP and expiry timestamp
    const hashedOtp = await this.hashPasswordOrOtp(otp);
    user.loginOtp = hashedOtp;
    user.loginOtpExpiresAt = new Date(Date.now()  + 5 * 60 * 1000);
    await userRepository.save(user);

    // 6. send OTP via email/SMS
    await this.sendOtpEmail(user, otp);

    return;
  }

  // resendLoginOtp()
  async resendLoginOtp(dto: RequestOtpDto) {
    // 1. Fetch user by email
    const user = await userRepository.findOne({
      where: { email: dto.email },
    });

    // 2. Validate user existence and active status
    if (!user || !user.isActive) {
      return;   // ignore silently
    };

    // 3. Prevent resending OTP if existing OTP is still valid
    if (user.loginOtpExpiresAt > new Date()) {
      throw new AppError(
        "OTP has already been sent", 
        HttpStatusCodes.TOO_MANY_REQUESTS
      );
    };

    // 4. Generate new one-time password (OTP)
    const otp = this.generateLoginOtp();

    // 5. Store new OTP and expiry timestamp
    const hashedOtp = await this.hashPasswordOrOtp(otp);
    user.loginOtp = hashedOtp;
    user.loginOtpExpiresAt = new Date(Date.now()  + 5 * 60 * 1000);
    await userRepository.save(user);

    // 6. send OTP via email/SMS
    await this.sendOtpEmail(user, otp);

    return;
  }

  // loginWithOtp()
  async loginWithOtp(dto: LoginOtpDto) {
    // 1. Fetch user by email
    const user = await userRepository.findOne({
      where: { email: dto.email }
    });

    // 2. Validate OTP existence and expiry
    if (
      !user ||
      !user.isActive ||
      !user.loginOtp ||
      this.comparePasswordOrOtp(dto.loginOtp, user.loginOtp) ||
      !user.loginOtpExpiresAt ||
      user.loginOtpExpiresAt < new Date()
    ) {
      throw new AppError(
        "Invalid or expired otp", 
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // 3. Clear OTP after successful verification
    await this.clearLoginOtp(user);

    // 4. generate JWT for authenticated session
    const token = this.generateJwt(user.id, user.role);

    return { 
      user, 
      token
    }
  }

  // ============================
  // Private helper functions
  // ============================

  // hashPasswordOrOtp()
  private async hashPasswordOrOtp(passwordOrOtp: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(passwordOrOtp, saltRounds);
  }

  // comparePassword()
  private async comparePasswordOrOtp(
    plainPasswordOrOtp: string, 
    hashedPasswordOrOtp: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPasswordOrOtp, hashedPasswordOrOtp);
  }

  // generateJwt()
  private generateJwt(userId: string, userRole: UserRole): string {
    return jwt.sign(
      { 
        sub: userId, 
        role: userRole
      }, 
      env.JWT_SECRET, 
      { expiresIn: "1d"}
    );
  }

  // generateLoginOtp()
  private generateLoginOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // clearLoginOtp()
  private async clearLoginOtp(user: User): Promise<void> {
    user.loginOtp = null;
    user.loginOtpExpiresAt = null;
    await userRepository.save(user);
  }

  // sendOtpEmail
  private async sendOtpEmail(user: User, otp: string) {
    const htmlTemplate = await fs.readFile(this.htmlTemplatePath, "utf-8");
    const htmlContent = htmlTemplate
    .replace("{{ name }}", user.name)
    .replace("{{ otp }}", otp)
    .replace("{{ content }}", "complete your login process")
    await this.transporter.sendEmail(
      user.email, 
      "Job Portal - Your Login OTP", 
      htmlContent
    );
  }
}
