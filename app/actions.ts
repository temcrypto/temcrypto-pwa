'use server';

import { rangeDelay } from 'delay';

// Search Pix data
export async function submitPixPayment(formData: FormData) {
  const rawFormData = {
    pixKey: formData.get('pixKey'),
    amount: formData.get('amount'),
  };

  // TODO: remove test delay
  await rangeDelay(1000, 5000);

  const txId = crypto.randomUUID();
  console.log('🚀 ~ submitPixPayment ~ rawFormData:', rawFormData, txId);

  return {
    toName: 'Cripto Fulanita',
    toPixKey:
      '00950376510014BR.GOV.BCB.PIX0118473029514573829746053039865802BR5925CriptoFulanita6009SAO PAULO61080540900032070303***63045181',
    amount: rawFormData.amount,
    rate: 4.77,
  };
}

// Create USDT payment
export async function createPayment(formData: FormData) {
  const rawFormData = {
    amount: formData.get('amount'),
  };

  console.log('🚀 ~ createPayment ~ rawFormData:', rawFormData);
}
