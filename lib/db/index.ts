import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(String(process.env.POSTGRES_URL), { prepare: false });

// Init DB instance
export const db = drizzle(client, { schema, logger: true });
export default db;
