import { memo, useCallback, useEffect, useState } from 'react';
import { LuQrCode } from 'react-icons/lu';
import { Sheet } from 'react-modal-sheet';
import { QrReader } from 'react-qr-reader';

interface QRCodeScannerProps {
  isOpen: boolean;
  sheetRootId?: string;
  onScan: (text: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

const QRCodeScanner = memo(
  function QRCodeScanner({
    isOpen = false,
    sheetRootId,
    onScan,
    onError,
    onClose,
  }: QRCodeScannerProps) {
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
      [onError],
    );

    // Handle result after scan
    const handleResult = useCallback(
      (result: any, error: any) => {
        if (!!result) {
          const text = result.getText();
          console.log('QR Code scanned: handleResult ', text);
          onScan(text);
        }

        // Check if the camera is allowed or close
        if (!!error && error.name.includes('NotAllowedError')) {
          handleQrError(error);
          // Close reader
          handleClose();
        }
      },
      [handleClose, handleQrError, onScan],
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
          <Sheet.Content className="safe-m-bottom">
            {hasCameraPermission ? (
              <QrReader
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
                  borderRadius: '1.5rem',
                  height: '300px',
                  width: '300px',
                }}
                videoStyle={{
                  zIndex: -100,
                }}
              />
            ) : (
              <>
                <div className="mb-12 text-center">
                  <div className="relative mb-12 inline-flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-pink-400">
                    <span className="text-3xl font-medium text-white">
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
                  className="mt-8 w-full cursor-pointer rounded-3xl bg-pink-500 p-4 text-center text-xl text-white transition ease-in-out active:bg-pink-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400"
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
              className="mt-4 flex w-full cursor-pointer items-center justify-center p-4 text-center"
              onClick={handleClose}
            >
              Cancel
            </button>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => false} />
      </Sheet>
    );
  },
  // Proper equality check for memoization
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen,
);

export default QRCodeScanner;
