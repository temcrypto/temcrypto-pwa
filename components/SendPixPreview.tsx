import { useCallback } from 'react';
import Sheet from 'react-modal-sheet';
import toast from 'react-hot-toast';
import { rangeDelay } from 'delay';

import { useSendPixContext } from '@/context/SendPixContext';
import AmountUSDT from './AmountUSDT';
import AmountBRL from './AmountBRL';

interface SendPixPreviewProps {
  isOpen: boolean;
  sheetRootId?: string;
  onSubmit: (data: any) => void; // TODO: Consider defining a more specific type for the data.
  onClose?: () => void;
}

const SendPixPreview = ({
  isOpen = false,
  sheetRootId,
  onSubmit,
  onClose,
}: SendPixPreviewProps) => {
  const { sendPixState, setSendPixState } = useSendPixContext();

  const handleSubmit = useCallback(
    (data: any) => {
      if (onSubmit) {
        onSubmit(data);
      }
    },
    [onSubmit]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleSumbit = useCallback(async () => {
    setSendPixState((prevState) => ({ ...prevState, sending: true }));

    // Here should handle the send payment action

    await rangeDelay(1000, 5000); // TODO: remove test delay
    toast.success('Send successfully!'); // TODO: retirect to success page/modal
    handleSubmit({ status: 'ok' });
  }, [setSendPixState, handleSubmit]);

  return (
    <Sheet
      isOpen={sendPixState.sending || isOpen}
      disableDrag={sendPixState.sending}
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
            <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
              <div className="text-sm text-slate-400 font-light uppercase">
                To
              </div>
              <p className="dark:text-white break-words">{sendPixState.name}</p>

              <div className="text-sm text-slate-400 font-light uppercase mt-4">
                Chave Pix
              </div>
              <p className="dark:text-white break-words">
                {sendPixState.reformatedPixKey}
              </p>
            </div>

            <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
              <div className="text-sm text-slate-400 font-light uppercase">
                Amount
              </div>
              <p className="dark:text-white break-words">
                <span>
                  <AmountBRL amount={sendPixState.amountBrl as number} />
                </span>
                <span className="pl-1 text-sm text-slate-300">
                  (<AmountUSDT amount={sendPixState.amountUsdt as number} />)
                </span>
              </p>

              <div className="text-sm text-slate-400 font-light uppercase mt-4">
                Rate
              </div>
              <p className="dark:text-white break-words">
                <AmountUSDT amount={1} /> ={' '}
                <AmountBRL amount={sendPixState.rateUsdtBrl as number} />
              </p>
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
            className="flex items-center justify-center w-full p-4 mt-4 text-center cursor-pointer disabled:cursor-not-allowed"
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
