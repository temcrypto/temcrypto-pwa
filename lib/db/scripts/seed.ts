import '@/lib/config';

import db from '@/lib/db';
import { type NewUser, users } from '../schema';

async function main() {
  const newUsers: NewUser[] = [
    {
      username: 'demo',
    },
    {
      username: 'demox',
    },
  ];

  await db.insert(users).values(newUsers).returning();
  process.exit();
}

main();
