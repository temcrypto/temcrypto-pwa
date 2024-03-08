'use client';

import { FormEvent, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { LuQrCode } from 'react-icons/lu';
import { rangeDelay } from 'delay';

import {
  type NewPayment,
  fetchPixKeyData,
  getSwapRateBrl,
  createPayment,
} from '@/app/send/actions';
import PageHeader from '@/components/PageHeader';
import PageWrapper from '@/components/PageWrapper';
import QRCodeScanner from '@/components/QRCodeScanner';
import SendPixForm from '@/components/SendPixForm';
import SendPixPreview from '@/components/SendPixPreview';
import { SendPixState, useSendPixContext } from '@/context/SendPixContext';

export default function Send() {
  const [openQrScanner, setOpenQrScanner] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const { sendPixState, setSendPixState, resetSendPixState } =
    useSendPixContext();

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

          setSendPixState((prevState) => ({
            ...prevState,
            ...({
              name: pixKeyData.name,
              pixKey: pixKeyData.pixKey,
              pixKeyParsed: pixKeyData.pixKeyParsed,
            } as SendPixState),
            ...(amountRateObj as SendPixState),
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
    [setSendPixState, openQrScanner]
  );

  const handleQrError = useCallback(() => {
    toast.error("Can't open the camera. Check permissions.");
  }, []);

  // Form helpers
  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      try {
        e.preventDefault(); // Prevent default form submission
        setSendPixState((prevState) => ({ ...prevState, loading: true }));

        if (!sendPixState.pixKey || !sendPixState.amountBrl) {
          throw new Error('Invalid pixKey or amountBrl');
        }

        const [pixKeyData, swapRates] = await Promise.all([
          fetchPixKeyData(sendPixState.pixKey),
          getSwapRateBrl(sendPixState.amountBrl),
        ]);

        console.log('🚀 ~ handleFormSubmit ~ pixKeyData:', pixKeyData);
        console.log(
          '🚀 ~ handleFormSubmit ~ swapRates:',
          swapRates,
          sendPixState.amountBrl
        );

        // TODO: remove test delay
        await rangeDelay(1000, 5000);

        setSendPixState((prevState) => ({
          ...prevState,
          ...({
            name: pixKeyData.name,
            pixKeyParsed: pixKeyData.pixKeyParsed,
            amountBrl: swapRates.amountBrl,
            amountUsdt: swapRates.amountUsdt,
            rateUsdtBrl: swapRates.rateUsdtBrl,
            loading: false,
          } as SendPixState),
        }));

        setOpenPreview(true);
      } catch (err) {
        console.error('handleFormSubmit error:', err);
        toast.error("Can't submit the form. Please try again.");
      } finally {
        setSendPixState((prevState) => ({ ...prevState, loading: false }));
      }
    },
    [setSendPixState, sendPixState.amountBrl, sendPixState.pixKey]
  );

  // Payment confirmation helper
  const handleConfirm = useCallback(async () => {
    try {
      // Here should handle the send payment action
      const newPayment: NewPayment = {
        pixName: sendPixState.name,
        pixKey: sendPixState.pixKey,
        pixKeyParsed: sendPixState.pixKeyParsed,
        amount: sendPixState.amountBrl!,
        amountUsdt: sendPixState.amountUsdt!,
        amountRate: sendPixState.rateUsdtBrl!,
      };
      const payment = await createPayment(newPayment);
      console.log('🚀 ~ handleConfirm ~ payment:', payment); // TODO: Cleanup

      resetSendPixState();
      toast.success('Payment sent successfully!'); // TODO: retirect to success page/modal
    } catch (err) {
      console.error('🚀 ~ handleConfirm ~ err:', err); // TODO: Improve logging
      toast.error('Falied to create payment. Please try again.');
    } finally {
      setOpenPreview(false);
      setSendPixState((prevState) => ({ ...prevState, sending: false }));
    }
  }, [resetSendPixState, sendPixState, setSendPixState]);

  return (
    <PageWrapper>
      <section id="page-send" className="pb-6">
        <PageHeader
          title="Send"
          subtitle="Scan a QR code or enter a Chave Pix: CPF, CNPJ, phone number, or email."
        />

        <button
          type="button"
          className="flex items-center justify-center transition ease-in-out w-full rounded-2xl p-4 mt-8 text-xl text-white bg-pink-500 ring ring-pink-500 active:bg-pink-700 active:ring-pink-700 hover:bg-pink-600 hover:ring-pink-600 disabled:text-slate-400 disabled:bg-slate-300 disabled:ring-slate-300 cursor-pointer disabled:cursor-not-allowed"
          disabled={sendPixState.loading || sendPixState.sending}
          onClick={() => {
            setOpenQrScanner(true);
          }}
        >
          <span className="mr-2">
            <LuQrCode />
          </span>
          Scan
        </button>

        <SendPixForm onSubmit={handleFormSubmit} />

        {/* Bottom Sheets */}
        <QRCodeScanner
          isOpen={openQrScanner}
          // sheetRootId="layout-app"
          onScan={handleQrScan}
          onError={handleQrError}
          onClose={() => {
            setOpenQrScanner(false);
          }}
        />

        <SendPixPreview
          isOpen={openPreview}
          // sheetRootId="layout-app"
          onConfirm={handleConfirm}
          onClose={() => {
            setOpenPreview(false);
          }}
        />
      </section>
    </PageWrapper>
  );
}
