import { db } from '.';
import { users } from './schema';

export async function getUsers() {
  const selectResult = await db.select().from(users);
  console.log("🚀 ~ getUsers ~ selectResult:", selectResult)
  return selectResult;
}
