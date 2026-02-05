import nodemailer, { Transporter } from "nodemailer";
import { env } from "./env.config";
import { logger } from "./logger.config";
import { AppError } from "@/common/errors/AppError";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class MailTransporter {
  private static instance: MailTransporter;
  private transporter?: nodemailer.Transporter;

  private constructor() {}

  public static getInstance(): MailTransporter {
    if (!MailTransporter.instance) {
      MailTransporter.instance = new MailTransporter();
    }
    return MailTransporter.instance;
  }

  public async init(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.EMAIL,
          pass: env.EMAIL_PASSWORD,
        },
      });
      await this.verifyConnection();
    } catch (error) {
      logger.error("Failed to initialize mail transporter: ", error);
      throw new AppError(
        "Failed to initialize mail transporter", 
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async verifyConnection(): Promise<void> {
    try {
      this.throwErrorIfNotInitialized();
      logger.info("Mail Transporter is ready to send emails");
    } catch (error) {
      logger.error("Mail Transporter connection failed: ", error);
      throw new AppError(
        "Mail Transporter connection failed", 
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {

    this.throwErrorIfNotInitialized();
    await this.transporter!.verify();

    try {
      await this.transporter.sendMail({
        from: `"Job Portal" <${env.EMAIL}>`,
        to,
        subject,
        html,
      });
      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error("Failed to send email: ", error);
      throw new AppError(
        "Failed to send email", 
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private throwErrorIfNotInitialized(): void{
    if (!this.transporter) {
      throw new AppError(
        "Mail transporter not initialized",
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}