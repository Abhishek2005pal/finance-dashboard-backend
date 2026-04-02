import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  PORT: z.preprocess((val) => parseInt(String(val), 10), z.number().positive()),
});

export const config = envSchema.parse(process.env);
