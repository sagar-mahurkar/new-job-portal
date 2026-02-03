import dotenv from "dotenv";
import { z, ZodError } from "zod";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "staging";

const envPath = path.resolve(
  process.cwd(),
  `../environments/.env.${NODE_ENV}`
);

// Load env
dotenv.config({ path: envPath });

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

  EMAIL: z.email("Invalid email address").transform((val) => val.trim().toLowerCase()).optional(),
  EMAIL_PASSWORD: z.string().length(16, "Must be exactly 16 characters").optional(),
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
