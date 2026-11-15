import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().optional(),
  DB_STORAGE: z.string().default("./rehmat_healthcare.sqlite"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const ENV = envSchema.parse(process.env);
