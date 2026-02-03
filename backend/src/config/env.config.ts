import dotenv from "dotenv";
import { z, ZodError } from "zod";

const NODE_ENV = process.env.NODE_ENV || "staging";

// Load env
dotenv.config({ path: `../environments/.env.${NODE_ENV}` })

// Define env schema
const envSchema = z.object({
  NODE_ENV: z.enum(["preprod", "staging"]),

  POSTGRES_HOST: z.string().default("0.0.0.0"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USERNAME: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),

  PORT: z.coerce.number().default(8080),

  JWT_SECRET: z.string().min(10),

  EMAIL: z.email("Invalid email address").transform((val) => val.trim().toLowerCase()),
  EMAIL_PASSWORD: z.string().length(16, "Must be exactly 16 characters"),
});

// Validate env
const parsedEnv = envSchema.safeParse(process.env);

// Throw error if critical env missing
if (!parsedEnv.success) {
  console.error("Invalid environment variables");
  if (parsedEnv.error instanceof ZodError) {
    console.error(parsedEnv.error.issues);
  } else {
    console.error(parsedEnv.error);
  }
  process.exit(1);
}

// Export config
export const env = parsedEnv.data;
