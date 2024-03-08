'use server';

import { redirect } from 'next/navigation';
import currency from 'currency.js';
import { eq } from 'drizzle-orm';

import db from '@/lib/db';
import { type NewTransaction, transactions, users } from '@/lib/db/schema';
import getRate from '@/lib/kp/getRate';
import validatePixKey from '@/lib/kp/validatePixKey';

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
type PixKeyData = {
  name: string;
  pixKey: string;
  pixKeyParsed: string;
  amount?: number;
};

export async function fetchPixKeyData(pixKey: string): Promise<PixKeyData> {
  try {
    // Validate and sanitize the input here if necessary.
    const pixData = await validatePixKey(pixKey);

    // Ensure the return type matches what's documented.
    return {
      name: pixData.name,
      pixKey: pixKey,
      pixKeyParsed: pixData.reformated_key,
      amount: Math.random() * (500 - 5) + 5, // TODO: Get amount from dynamic Pix Key Data or return null.
    };
  } catch (err) {
    console.error('🚀 ~ fetchPixKeyData ~ err:', err); // TODO: Improve logging
    // Provides a more useful error handling for the consumers of the function.
    throw new Error('Failed to fetch Pix key data');
  }
}

// Swap Rates - Where the magic happens... ✨
type SwapRateBrl = {
  amountBrl: number;
  amountUsdt: number;
  rateUsdtBrl: number;
  timeout: number;
};

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
    console.error('🚀 ~ getSwapRateBrl ~ err:', err); // TODO: Improve logging
    // Provides a more useful error handling for the consumers of the function.
    throw new Error('Failed to get the swap rate for BRL');
  }
}

// Create Payment
// Here we create the transction and set other parts of a payment process like smart wallet process
export type NewPayment = Pick<
  NewTransaction,
  'amount' | 'amountRate' | 'amountUsdt' | 'pixName' | 'pixKey' | 'pixKeyParsed'
>;

export async function createPayment(data: NewPayment) {
  let txData = undefined;

  try {
    // TODO: Validate data

    // const user = await db.select().from(users).where(eq(users.username, 'demo'));
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

    txData = txResponse[0];
  } catch (err) {
    console.error('🚀 ~ createPayment ~ err:', err); // TODO: Improve logging
    // Provides a more useful error handling for the consumers of the function.
    throw new Error('Failed to create payment');
  }

  redirect(`/txs/${txData.id}`);
}

// Transactions
export async function fetchTxById(txId: string) {
  // TODO: Validate input
  const txData = await db.query.transactions.findFirst({
    where: eq(transactions.id, txId),
  });

  if (!txData) {
    throw new Error('Transaction not found');
  }

  return txData;
}
