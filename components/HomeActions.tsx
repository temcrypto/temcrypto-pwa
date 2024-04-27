import { useState } from 'react';
import { FaPix } from 'react-icons/fa6';
import Sheet from 'react-modal-sheet';

import Link from '@/components/Link';

export default function HomeActions() {
  const [isSheetOpen, setSheetOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex rounded-2xl h-14 space-x-1 p-1 border-2 border-rose-500 text-center items-center">
        <div className="flex-1 rounded-l-xl transition active:scale-95">
          Pay
        </div>
        <div className="flex-1 transition active:scale-95">Deposit</div>
        <div className="flex-1 rounded-r-xl transition active:scale-95">
          Send
        </div>
      </div>

      <Sheet
        isOpen={isSheetOpen}
        onClose={() => {
          setSheetOpen(false);
        }}
        detent="content-height"
        // rootId={sheetRootId}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <nav className="flex flex-col justify-center space-y-6 safe-m-bottom">
              <Link
                href="/send"
                className="flex py-2"
                onClick={() => {
                  setSheetOpen(false);
                }}
              >
                <div className="flex flex-row">
                  <div className="flex items-center justify-center text-3xl text-[#32BCAD]">
                    <FaPix />
                  </div>
                  <div className="ml-4">
                    <div className="">Send Pix</div>
                    <div className="text-slate-400 font-light text-sm">
                      Scan a QR code or enter a Chave Pix
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/receive"
                className="flex py-2"
                onClick={() => {
                  setSheetOpen(false);
                }}
              >
                <div className="flex flex-row">
                  <div className="flex items-center justify-center text-3xl text-[#32BCAD]">
                    <FaPix />
                  </div>
                  <div className="ml-4">
                    <div className="">Receive Pix</div>
                    <div className="text-slate-400 font-light text-sm">
                      Generate a QR code to receive Pix
                    </div>
                  </div>
                </div>
              </Link>
            </nav>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setSheetOpen(false)} />
      </Sheet>
    </>
  );
}
