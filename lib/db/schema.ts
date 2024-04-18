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
  username: text('username').unique().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Enums
export const txStatusEnum = pgEnum('tx_status', [
  // INFO: Replicate KP statuses
  'mined',
  'dropped',
  'processing',
  'done',
  'failed',
]);
export const txTypeEnum = pgEnum('tx_type', ['pay', 'charge']);
export const txCurrencyEnum = pgEnum('tx_currency', ['BRL', 'USDT']);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    status: txStatusEnum('status').notNull(),
    type: txTypeEnum('type').notNull(),
    amount: numeric('amount').notNull().$type<number>(),
    amountUsdt: numeric('amount_usdt').notNull().$type<number>(),
    amountRate: numeric('amount_rate').notNull().$type<number>(),
    currency: txCurrencyEnum('currency').notNull(),
    pixName: text('pix_name').notNull(),
    pixKey: text('pix_key').notNull(),
    pixKeyParsed: text('pix_key_parsed').notNull(),
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
