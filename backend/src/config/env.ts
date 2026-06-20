import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const defaultJwtSecret = 'dev-jwt-secret-change-in-production';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    LOG_FORMAT: z.string().default('dev'),
    JWT_SECRET: z.string().min(32).default(defaultJwtSecret),
    JWT_EXPIRES_IN: z.string().default('7d'),
  })
  .superRefine((config, context) => {
    if (config.NODE_ENV === 'production' && config.JWT_SECRET === defaultJwtSecret) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET must be set to a strong unique value in production',
        path: ['JWT_SECRET'],
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(details)}`);
}

export const env = parsedEnv.data;
