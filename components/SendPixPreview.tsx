import { useCallback } from 'react';
import Sheet from 'react-modal-sheet';
import TxPreviewCard from './TxPreviewCard';

interface SendPixPreviewProps {
  isOpen: boolean;
  sheetRootId?: string;
  previewData: any; // TODO: Fix typing
  onClose?: () => void;
}

const defaultPreviewData = {
  toName: '',
  toPixKey: '',
  amount: '',
  rate: '',
};

const SendPixPreview = ({
  isOpen = false,
  sheetRootId,
  previewData,
  onClose,
}: SendPixPreviewProps) => {
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const {
    toName = '',
    toPixKey = '',
    amount = '',
    rate = '',
  } = {
    ...defaultPreviewData,
    ...previewData,
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={handleClose}
      detent="content-height"
      rootId={sheetRootId}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="mb-4">
            <h1 className="mb-4 text-2xl">Review details</h1>
            <p className="text-md text-slate-500">
              Almost there! Just make sure your payment details are correct.
            </p>
          </div>

          <Sheet.Scroller>
            <TxPreviewCard title="To" content={toName} />

            <TxPreviewCard title="Chave Pix" content={toPixKey} />

            <div className="flex space-x-8">
              <TxPreviewCard title="Amount" content={`R$  ${amount}`} />
              <TxPreviewCard title="Rate" content={`1 USDT = R$ ${rate}`} />
            </div>
          </Sheet.Scroller>

          <button className="transition ease-in-out w-full mt-8 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-2xl p-4 text-center text-white text-xl cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400 ring ring-pink-500 disabled:ring-slate-300 hover:ring-pink-600 active:ring-pink-700">
            Confirm
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full p-4 mt-4 text-center cursor-pointer"
            onClick={handleClose}
          >
            Cancel
          </button>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};

export default SendPixPreview;
