'use server';

import validatePixKey from '@/libs/kp/validatePixKey';
import { rangeDelay } from 'delay';

// Submit Pix Payment data
export async function submitPixPayment(formData: any) {
  // const rawFormData = {
  //   pixKey: formData.get('pixKey'),
  //   amount: formData.get('amount'),
  // };

  // TODO: remove test delay
  await rangeDelay(1000, 5000);

  const txId = crypto.randomUUID();
  console.log('🚀 ~ submitPixPayment ~ rawFormData:', formData, txId);

  return {
    toName: 'Cripto Fulanita',
    toPixKey:
      '00950376510014BR.GOV.BCB.PIX0118473029514573829746053039865802BR5925CriptoFulanita6009SAO PAULO61080540900032070303***63045181',
    amount: formData.amount,
    rate: 4.77,
  };
}

type PixKeyData = {
  name: string;
  pixKey: string;
  reformatedPixKey: string;
  amount?: string;
};

/**
 * Fetches Pix key data from the KP API and formats the response.
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
  console.log('🚀 ~ fetchPixKeyData ~ pixKey:', pixKey);

  try {
    // Validate and sanitize the input here if necessary.
    const pixData = await validatePixKey(pixKey);

    // Ensure the return type matches what's documented.
    return {
      name: pixData.name,
      pixKey: pixKey,
      reformatedPixKey: pixData.reformated_key,
      amount: '10',
    };
  } catch (err) {
    console.error('🚀 ~ fetchPixKeyData ~ err:', err);
    // Provides a more useful error handling for the consumers of the function.
    throw new Error('Failed to fetch Pix key data');
  }
}

// Create USDT payment
export async function createPayment(formData: FormData) {
  const rawFormData = {
    amount: formData.get('amount'),
  };

  console.log('🚀 ~ createPayment ~ rawFormData:', rawFormData);
}
