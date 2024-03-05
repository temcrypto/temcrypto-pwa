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
import { BRL, USDT } from '@/lib/currency';

export default function Send() {
  const [openQrScanner, setOpenQrScanner] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const { sendPixState, setSendPixState } = useSendPixContext();

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
            const swapRates = await getSwapRate(pixKeyData.amount);
            console.log('🚀 ~ swapRates:', swapRates);
            amountRateObj = {
              amountBrl: BRL(pixKeyData.amount).value,
              amountUsdt: USDT(swapRates.amountUsdt).value,
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
        toast.error("Can't fetch the Pix Key data. Try again please."); // TODO: Improve UI error messages
      } finally {
        setOpenQrScanner(false);
        console.log('🚀 ~ setOpenQrScanner: finally', openQrScanner);
      }
    },
    [setSendPixState, openQrScanner]
  );

  const handleQrError = useCallback(() => {
    toast.error("Can't opening the camera. Check permissions.");
  }, []);

  // Form helpers
  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      console.log('🚀 ~ Send ~ handleFormSubmit:', e);
      try {
        e.preventDefault(); // Prevent default form submission
        setSendPixState((prevState) => ({ ...prevState, loading: true }));

        const pixKeyData = await fetchPixKeyData(sendPixState.pixKey);
        console.log('🚀 ~ handleFormSubmit ~ pixKeyData:', pixKeyData);

        const swapRates = await getSwapRate(sendPixState.amountBrl);
        console.log('🚀 ~ swapRates:', swapRates);

        // TODO: remove test delay
        await rangeDelay(1000, 5000);

        setSendPixState((prevState) => ({
          ...prevState,
          ...{
            name: pixKeyData.name,
            reformatedPixKey: pixKeyData.reformatedPixKey,
            amountUsdt: USDT(swapRates.amountUsdt).toString(),
            rateUsdtBrl: swapRates.rateUsdtBrl,
            loading: false,
          },
        }));

        setOpenPreview(true);
      } catch (err) {
        console.log('🚀 ~ Send ~ handleFormSubmit error:', err);
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
          className="flex items-center justify-center w-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-2xl p-4 text-center text-white text-xl mt-8 cursor-pointer"
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
            console.log('🚀 ~ Send ~ QRCodeScanner onClose:');
            setOpenQrScanner(false);
          }}
        />

        <SendPixPreview
          isOpen={openPreview}
          sheetRootId="layout-app"
          onClose={() => {
            console.log('🚀 ~ Send ~ SendPixPreview onClose:');
            setOpenPreview(false);
          }}
        />
      </section>
    </PageWrapper>
  );
}
