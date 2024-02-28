'use client';

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { LuQrCode } from 'react-icons/lu';

import PageHeader from '@/components/PageHeader';
import PageWrapper from '@/components/PageWrapper';
import QRCodeScanner from '@/components/QRCodeScanner';
import SendPixForm from '@/components/SendPixForm';
import SendPixPreview from '@/components/SendPixPreview';

export default function Send() {
  const [qrPixKey, setQrPixKey] = useState('');
  const [openQrScanner, setOpenQrScanner] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // QRCodeScanner helpers
  const handleQrScan = useCallback((text: string) => {
    setQrPixKey(text);
  }, []);

  const handleQrError = useCallback((error: Error) => {
    toast.error("Can't opening the camera. Check permissions.");
  }, []);

  // Form helpers
  const handleFormSubmit = useCallback((data: any) => {
    // TODO: Fix typing
    setPreviewData(data);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setPreviewData(null);
  }, []);

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

        <SendPixForm initialPixKey={qrPixKey} onSubmit={handleFormSubmit} />

        <QRCodeScanner
          isOpen={openQrScanner}
          sheetRootId="layout-app"
          onScan={handleQrScan}
          onError={handleQrError}
          onClose={() => {
            setOpenQrScanner(false);
          }}
        />

        <SendPixPreview
          isOpen={!!previewData}
          sheetRootId="layout-app"
          previewData={previewData}
          onClose={handlePreviewClose}
        />
      </section>
    </PageWrapper>
  );
}
