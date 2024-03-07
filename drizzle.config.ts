import '@/lib/config';

import { type Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: String(process.env.POSTGRES_URL),
  },
  verbose: true,
  strict: true,
} satisfies Config;
