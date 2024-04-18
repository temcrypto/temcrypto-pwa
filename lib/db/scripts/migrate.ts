import '@/lib/config';

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db from '@/lib/db';

async function main() {
  await migrate(db, { migrationsFolder: './drizzle' });
  process.exit();
}

main();
