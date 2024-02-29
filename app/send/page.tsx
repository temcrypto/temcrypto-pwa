'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuQrCode } from 'react-icons/lu';

import { fetchPixKeyData } from '@/app/actions';
import PageHeader from '@/components/PageHeader';
import PageWrapper from '@/components/PageWrapper';
import QRCodeScanner from '@/components/QRCodeScanner';
import SendPixForm from '@/components/SendPixForm';
import SendPixPreview from '@/components/SendPixPreview';
import { useSendPixContext } from '@/context/SendPixContext';

export default function Send() {
  const [openQrScanner, setOpenQrScanner] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const { setSendPixState } = useSendPixContext();

  // QRCodeScanner helpers
  const handleQrScan = useCallback(
    async (text: string) => {
      try {
        if (openQrScanner && text !== '') {
          const pixKeyData = await fetchPixKeyData(text);
          console.log(
            '🚀 ~ handleQrScan ~ pixKeyData:',
            pixKeyData,
            openQrScanner
          );

          setSendPixState((prevState) => ({
            ...prevState,
            ...{
              name: pixKeyData.name,
              pixKey: pixKeyData.pixKey,
              reformatedPixKey: pixKeyData.reformatedPixKey,
            },
            ...(pixKeyData.amount && { amount: pixKeyData.amount }),
          }));
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
  const handleFormSubmit = useCallback((data: any) => {
    setOpenPreview(true);
  }, []);

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
