'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuQrCode } from 'react-icons/lu';
import { rangeDelay } from 'delay';

import { fetchPixKeyData, getSwapRate } from '@/app/actions';
import PageHeader from '@/components/PageHeader';
import PageWrapper from '@/components/PageWrapper';
import QRCodeScanner from '@/components/QRCodeScanner';
import SendPixForm from '@/components/SendPixForm';
import SendPixPreview from '@/components/SendPixPreview';
import { useSendPixContext } from '@/context/SendPixContext';

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
            const swapRates = await getSwapRate(pixKeyData.amount); // TODO: Validate and format the amount from KP
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
            ...{
              name: pixKeyData.name,
              pixKey: pixKeyData.pixKey,
              reformatedPixKey: pixKeyData.reformatedPixKey,
            },
            ...amountRateObj,
          }));

          // Open preview sheet if we have all the necessary info
          if (!!(pixKeyData.amount && pixKeyData.reformatedPixKey)) {
            setOpenPreview(true);
          }
        }
      } catch (err) {
        console.log('🚀 ~ handleQrScan ~ err:', err);
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
          getSwapRate(sendPixState.amountBrl),
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
          ...{
            name: pixKeyData.name,
            reformatedPixKey: pixKeyData.reformatedPixKey,
            amountBrl: swapRates.amountBrl,
            amountUsdt: swapRates.amountUsdt,
            rateUsdtBrl: swapRates.rateUsdtBrl,
            loading: false,
          },
        }));

        setOpenPreview(true);
      } catch (err) {
        console.log('🚀 ~ Send ~ handleFormSubmit error:', err);
        toast.error("Can't submit the form. Please try again.");
      } finally {
        setSendPixState((prevState) => ({ ...prevState, loading: false }));
      }
    },
    [setSendPixState, sendPixState.amountBrl, sendPixState.pixKey]
  );

  useEffect(() => {
    console.log('🚀 ~ openQrScanner changed:', openQrScanner);
  }, [openQrScanner]);

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
          sheetRootId="layout-app"
          onScan={handleQrScan}
          onError={handleQrError}
          onClose={() => {
            console.log('🚀 ~ Send ~ QRCodeScanner onClose');
            setOpenQrScanner(false);
          }}
        />

        <SendPixPreview
          isOpen={openPreview}
          sheetRootId="layout-app"
          onSubmit={(data) => {
            console.log('🚀 ~ Send ~ SendPixPreview onSubmit:', data);
            resetSendPixState();
            setOpenPreview(false);
          }}
          onClose={() => {
            console.log('🚀 ~ Send ~ SendPixPreview onClose');
            setOpenPreview(false);
          }}
        />
      </section>
    </PageWrapper>
  );
}
