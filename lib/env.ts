import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default("gpt-5-mini"),
  BRAVE_API_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
  INGEST_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_REFRESH_INTERVAL_MS: z
    .string()
    .default("90000")
    .transform((value) => Number(value))
});

export const env = envSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  BRAVE_API_KEY: process.env.BRAVE_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  CRON_SECRET: process.env.CRON_SECRET,
  INGEST_SECRET: process.env.INGEST_SECRET,
  NEXT_PUBLIC_REFRESH_INTERVAL_MS: process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS
});
