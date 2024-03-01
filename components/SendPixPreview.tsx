import { useCallback } from 'react';
import Sheet from 'react-modal-sheet';
import { rangeDelay } from 'delay';
import { useSendPixContext } from '@/context/SendPixContext';
import TxPreviewCard from './TxPreviewCard';
import toast from 'react-hot-toast';

interface SendPixPreviewProps {
  isOpen: boolean;
  sheetRootId?: string;
  onClose?: () => void;
}

const SendPixPreview = ({
  isOpen = false,
  sheetRootId,
  onClose,
}: SendPixPreviewProps) => {
  const { sendPixState, setSendPixState } = useSendPixContext();

  const handleSumbit = useCallback(async () => {
    try {
      console.log('🚀 ~ handleSumbit ~ handleSumbit:');
      setSendPixState((prevState) => ({ ...prevState, sending: true }));
      await rangeDelay(1000, 5000);
    } catch (err) {
      console.log('🚀 ~ handleSumbit ~ err:', err);
    } finally {
      setSendPixState((prevState) => ({ ...prevState, sending: false }));
      toast.success('Send successfully!');
    }
  }, [setSendPixState]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Sheet
      isOpen={sendPixState.sending || isOpen}
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
            <TxPreviewCard title="To" content={sendPixState.name} />

            <TxPreviewCard title="Chave Pix" content={sendPixState.pixKey} />

            <div className="flex space-x-8">
              <TxPreviewCard
                title="Amount"
                content={`R$  ${sendPixState.amount}`}
              />
              <TxPreviewCard
                title="Rate"
                content={`1 USDT = R$ ${sendPixState.rateUsdtBrl}`}
              />
            </div>
          </Sheet.Scroller>

          <button
            className={`transition ease-in-out w-full rounded-2xl p-4 mt-8 text-center text-xl text-white bg-pink-500 ring ring-pink-500 active:bg-pink-700 active:ring-pink-700 hover:bg-pink-600 hover:ring-pink-600 disabled:text-slate-400 disabled:bg-slate-300 disabled:ring-slate-300 cursor-pointer disabled:cursor-not-allowed ${
              sendPixState.sending ? 'animate-pulse' : ''
            }`}
            onClick={handleSumbit}
            disabled={sendPixState.sending}
          >
            Confirm and send
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full p-4 mt-4 text-center cursor-pointer"
            onClick={handleClose}
            disabled={sendPixState.sending}
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
