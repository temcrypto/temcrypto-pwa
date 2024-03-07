import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Schemas
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Enums
export const statusEnum = pgEnum('status', [
  // INFO: Replicate KP statuses
  'mined',
  'dropped',
  'processing',
  'done',
  'failed',
]);
export const typeEnum = pgEnum('type', ['pay', 'charge']);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    status: statusEnum('status').notNull(),
    type: typeEnum('type').notNull(),
    amount: numeric('amount').notNull(),
    pixName: text('pix_name').notNull(),
    pixKey: text('pix_key').notNull(),
    pixKeyReformated: text('pix_key_reformated').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);

// Types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;
