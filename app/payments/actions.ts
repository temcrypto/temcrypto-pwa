'use server';

import { redirect } from 'next/navigation';
import currency from 'currency.js';
import { eq } from 'drizzle-orm';

import db from '@/lib/db';
import { type NewTransaction, transactions, users } from '@/lib/db/schema';
import getRate from '@/lib/kp/get-rate';
import validatePixKey from '@/lib/kp/validate-pix-key';
import { rangeDelay } from 'delay';

// Types
type PixKeyData = {
  name: string;
  pixKey: string;
  pixKeyParsed: string;
  amount?: number;
};

type SwapRateBrl = {
  amountBrl: number;
  amountUsdt: number;
  rateUsdtBrl: number;
  timeout: number;
};

/**
 * Fetches Pix Key Data from the KP API and formats the response.
 *
 * This function takes a Pix key or QR content as input, validates and sanitizes it if necessary,
 * then uses the `validatePixKey` function to fetch the corresponding Pix data. If successful,
 * it returns the data in a formatted manner. In case of an error, it returns a descriptive error
 * that can be handled by the function's consumers.
 *
 * @param {string} pixKey - The Pix key or QR content to be validated.
 * @returns {Promise<PixKeyData>} - Formatted Pix data or an error object.
 */
export async function fetchPixKeyData(pixKey: string): Promise<PixKeyData> {
  // Validate and sanitize the input
  if (!pixKey || typeof pixKey !== 'string') {
    throw new Error('Invalid Pix key format');
  }

  try {
    const pixData = await validatePixKey(pixKey);

    // Ensure the return type matches what's documented.
    return {
      name: pixData.name,
      pixKey: pixKey,
      pixKeyParsed: pixData.reformated_key,
      amount: Math.random() * (500 - 5) + 5, // TODO: Get amount from dynamic Pix Key Data or return null.
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to fetch Pix key data: ${err.message}`, err);
    } else {
      console.error('Failed to fetch Pix key data: Unknown error');
    }
    throw new Error('Failed to fetch Pix key data');
  }
}

/**
 * Swap Rates - Where the magic happens... ✨
 * Retrieves and calculates the swap rate between BRL and USDT.
 * Throws an error if the operation fails.
 *
 * @param {number} amountBrl - The amount in BRL to be converted.
 * @returns {Promise<SwapRateBrl>} The calculated swap rate details.
 */
export async function getSwapRateBrl(amountBrl: number): Promise<SwapRateBrl> {
  try {
    const { data } = await getRate('BRLUSDT', 'charge', amountBrl);

    return {
      amountBrl: amountBrl,
      amountUsdt: data.total_usdt,
      rateUsdtBrl: currency(amountBrl).divide(data.total_usdt).value,
      timeout: data.timeout,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to get the swap rate for BRL: ${err.message}`, err);
    } else {
      console.error('Failed to get the swap rate for BRL: Unknown error');
    }
    throw new Error('Failed to get the swap rate for BRL');
  }
}

/**
 * Creates a payment transaction in the database.
 * Validates the input data, checks for a valid user, and inserts a new transaction.
 * Redirects to the transaction details page upon successful creation.
 *
 * @param {NewPayment} data - The data for the new payment transaction.
 * @throws {Error} Throws an error if user validation fails or the transaction cannot be created.
 */
export type NewPayment = Pick<
  NewTransaction,
  'amount' | 'amountRate' | 'amountUsdt' | 'pixName' | 'pixKey' | 'pixKeyParsed'
>;

export async function createPayment(data: NewPayment) {
  let txData: Pick<NewTransaction, 'id'> | undefined = undefined;

  try {
    // TODO: Validate data

    // TODO: Get the current user instead "demo"
    const user = await db.query.users.findFirst({
      where: eq(users.username, 'demo'),
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newTransaction: NewTransaction = {
      userId: user.id,
      pixName: data.pixName,
      pixKey: data.pixKey,
      pixKeyParsed: data.pixKeyParsed,
      amount: data.amount,
      amountUsdt: data.amountUsdt,
      amountRate: data.amountRate,
      type: 'pay',
      status: 'mined',
      currency: 'BRL',
    };

    const txResponse = await db
      .insert(transactions)
      .values(newTransaction)
      .returning({ id: transactions.id });

    await rangeDelay(10000, 20000);

    txData = txResponse[0];
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to create payment: ${err.message}`, err);
    } else {
      console.error('Failed to create payment: Unknown error');
    }
    throw new Error('Failed to create payment');
  }

  redirect(`/txs/${txData.id}`);
}

/**
 * Fetches a transaction by its ID from the database.
 * Validates the transaction ID and returns transaction data if found.
 *
 * @param {string} txId - The ID of the transaction to fetch.
 * @returns {Promise<NewTransaction>} The transaction data.
 * @throws {Error} Throws an error if the transaction ID is invalid or the transaction is not found.
 */
export async function fetchTxById(txId: string): Promise<NewTransaction> {
  // TODO: Validate input
  const txData = await db.query.transactions.findFirst({
    where: eq(transactions.id, txId),
  });

  if (!txData) {
    throw new Error('Transaction not found');
  }

  return txData;
}
