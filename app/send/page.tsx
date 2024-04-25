'use client';

import { FormEvent, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { rangeDelay } from 'delay';

import {
  type NewPayment,
  fetchPixKeyData,
  getSwapRateBrl,
  createPayment,
} from '@/app/send/actions';

import PageWrapper from '@/components/PageWrapper';
import QRCodeScanner from '@/components/QRCodeScanner';
import PixPaymentForm from '@/components/PixPaymentForm';
import PixPaymentPreview from '@/components/PixPaymentPreview';

import {
  type PixPaymentState,
  usePixPaymentContext,
} from '@/context/PixPaymentContext';

export default function Send() {
  const { data: session, status } = useSession({ required: true });
  const [openQrScanner, setOpenQrScanner] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const { pixPaymentState, setPixPaymentState, resetPixPaymentState } =
    usePixPaymentContext();

  // QRCodeScanner helpers
  const handleQrScan = useCallback(
    async (text: string) => {
      try {
        // Validate scanned text
        if (openQrScanner && text !== '') {
          const pixKeyData = await fetchPixKeyData(text);
          console.log(
            '🚀 ~ handleQrScan ~ pixKeyData:',
            pixKeyData,
            openQrScanner
          );

          let amountRateObj = {};
          if (pixKeyData.amount) {
            const swapRates = await getSwapRateBrl(pixKeyData.amount); // TODO: Validate and format the amount from KP
            console.log('🚀 ~ swapRates:', swapRates);

            amountRateObj = {
              amountBrl: pixKeyData.amount,
              amountUsdt: swapRates.amountUsdt,
              rateUsdtBrl: swapRates.rateUsdtBrl,
              // timeout: swapRates.timeout,
            };
          }

          setPixPaymentState((prevState) => ({
            ...prevState,
            ...({
              name: pixKeyData.name,
              pixKey: pixKeyData.pixKey,
              pixKeyParsed: pixKeyData.pixKeyParsed,
            } as PixPaymentState),
            ...(amountRateObj as PixPaymentState),
          }));

          // Open preview sheet if we have all the necessary info
          if (!!(pixKeyData.amount && pixKeyData.pixKeyParsed)) {
            setOpenPreview(true);
          }
        }
      } catch (err) {
        console.error('handleQrScan ~ err:', err);
        toast.error("Can't fetch the Pix Key data. Plase try again."); // TODO: Improve UI error messages
      } finally {
        setOpenQrScanner(false);
        console.log('🚀 ~ setOpenQrScanner: finally', openQrScanner);
      }
    },
    [setPixPaymentState, openQrScanner]
  );

  const handleQrError = useCallback(() => {
    toast.error("Can't open the camera. Check permissions.");
  }, []);

  // Form helpers
  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      try {
        e.preventDefault(); // Prevent default form submission
        setPixPaymentState((prevState) => ({ ...prevState, loading: true }));

        if (!pixPaymentState.pixKey || !pixPaymentState.amountBrl) {
          throw new Error('Invalid pixKey or amountBrl');
        }

        const [pixKeyData, swapRates] = await Promise.all([
          fetchPixKeyData(pixPaymentState.pixKey),
          getSwapRateBrl(pixPaymentState.amountBrl),
        ]);

        console.log('🚀 ~ handleFormSubmit ~ pixKeyData:', pixKeyData);
        console.log(
          '🚀 ~ handleFormSubmit ~ swapRates:',
          swapRates,
          pixPaymentState.amountBrl
        );

        // TODO: remove test delay
        await rangeDelay(1000, 5000);

        setPixPaymentState((prevState) => ({
          ...prevState,
          ...({
            name: pixKeyData.name,
            pixKeyParsed: pixKeyData.pixKeyParsed,
            amountBrl: swapRates.amountBrl,
            amountUsdt: swapRates.amountUsdt,
            rateUsdtBrl: swapRates.rateUsdtBrl,
            loading: false,
          } as PixPaymentState),
        }));

        setOpenPreview(true);
      } catch (err) {
        console.error('handleFormSubmit error:', err);
        toast.error("Can't submit the form. Please try again.");
      } finally {
        setPixPaymentState((prevState) => ({ ...prevState, loading: false }));
      }
    },
    [setPixPaymentState, pixPaymentState.amountBrl, pixPaymentState.pixKey]
  );

  // Payment confirmation helper
  const handleConfirm = useCallback(async () => {
    try {
      // Here should handle the send payment action
      const newPayment: NewPayment = {
        pixName: pixPaymentState.name,
        pixKey: pixPaymentState.pixKey,
        pixKeyParsed: pixPaymentState.pixKeyParsed,
        amount: pixPaymentState.amountBrl!,
        amountUsdt: pixPaymentState.amountUsdt!,
        amountRate: pixPaymentState.rateUsdtBrl!,
      };

      await createPayment(newPayment);
      resetPixPaymentState();
      toast.success('Payment sent successfully!'); // TODO: retirect to success page/modal
    } catch (err) {
      console.error('🚀 ~ handleConfirm ~ err:', err); // TODO: Improve logging
      toast.error('Falied to create payment. Please try again.');
      setPixPaymentState((prevState) => ({ ...prevState, sending: false }));
      // setOpenPreview(false);
    }
  }, [pixPaymentState, setPixPaymentState, resetPixPaymentState]);

  if (status !== 'authenticated') return null;

  return (
    <PageWrapper id="page-send">
      <div className="mb-8">
        <p className="text-xl text-slate-500">
          Scan a QR code or enter a Chave Pix: CPF, CNPJ, phone number, or
          email.
        </p>
      </div>

      <PixPaymentForm
        onScanQR={() => {
          if (!pixPaymentState.sending) setOpenQrScanner(true);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Bottom Sheets */}
      <QRCodeScanner
        isOpen={openQrScanner}
        // sheetRootId="layout-app"
        onScan={handleQrScan}
        onError={handleQrError}
        onClose={() => setOpenQrScanner(false)}
      />

      <PixPaymentPreview
        isOpen={openPreview}
        // sheetRootId="layout-app"
        onConfirm={handleConfirm}
        onClose={() => setOpenPreview(false)}
      />
    </PageWrapper>
  );
}
