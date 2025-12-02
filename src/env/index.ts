import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
} else {
  config();
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('🤖 invalid environment variables!', z.treeifyError(_env.error).properties);
  process.exit(1);
}

export const env = _env.data;
