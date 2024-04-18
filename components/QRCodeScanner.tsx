import { useCallback, useEffect, useState } from 'react';
import { LuQrCode } from 'react-icons/lu';
import Sheet from 'react-modal-sheet';
import { QrReader } from 'react-qr-reader';

interface QRCodeScannerProps {
  isOpen: boolean;
  sheetRootId?: string;
  onScan: (text: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

const QRCodeScanner = ({
  isOpen = false,
  sheetRootId,
  onScan,
  onError,
  onClose,
}: QRCodeScannerProps) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  // Component events handlers
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleQrError = useCallback(
    (error: Error) => {
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  // Handle result after scan
  const handleResult = useCallback(
    (result: any, error: any) => {
      if (!!result) {
        // TODO: check if we can get the amount and update the amount input
        const text = result.getText();
        onScan(text);
      }

      // Check if the camera is allowed or close
      if (!!error && error.name.includes('NotAllowedError')) {
        handleQrError(error);
        // Close reader
        handleClose();
      }
    },
    [handleClose, handleQrError, onScan]
  );

  // Check Camera permission
  useEffect(() => {
    const checkCameraPermission = () => {
      navigator.permissions
        .query({ name: 'camera' as PermissionName })
        .then((permissionStatus) => {
          const hasCameraPermission = permissionStatus.state === 'granted';
          setHasCameraPermission(hasCameraPermission);
        });
    };

    checkCameraPermission();
  }, []);

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
          {hasCameraPermission ? (
            <QrReader
              videoId="pixScan"
              constraints={{
                aspectRatio: 1,
                facingMode: 'environment',
              }}
              scanDelay={500}
              onResult={handleResult}
              ViewFinder={() => (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                  }}
                ></div>
              )}
              videoContainerStyle={{
                position: 'relative',
                padding: 0,
                margin: '0 auto',
                border: '4px solid rgb(236, 72, 153)',
                borderRadius: '1rem',
                height: '350px',
                width: '350px',
              }}
              videoStyle={{
                zIndex: -100,
              }}
            />
          ) : (
            <>
              <div className="text-center mb-12">
                <div className="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-pink-400 rounded-full mb-12">
                  <span className="font-medium text-3xl text-white">
                    <LuQrCode />
                  </span>
                </div>
                <h1 className="mb-4 text-2xl">
                  Do you give us permission to use the camera?
                </h1>
                <p className="text-md text-slate-500">
                  This way you can use your QR reader
                </p>
              </div>
              <button
                className="transition ease-in-out w-full mt-8 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-2xl p-4 text-center text-white text-xl cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400 ring ring-pink-500 disabled:ring-slate-300 hover:ring-pink-600 active:ring-pink-700"
                onClick={() => {
                  setHasCameraPermission(true);
                }}
              >
                Grant permission
              </button>
            </>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full p-4 mt-4 text-center cursor-pointer"
            onClick={handleClose}
          >
            Cancel
          </button>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => false} />
    </Sheet>
  );
};

export default QRCodeScanner;
