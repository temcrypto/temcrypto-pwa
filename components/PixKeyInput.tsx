'use client';

import {
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

// Function to check and request clipboard read permissions
async function checkAndRequestClipboardReadPermissions(): Promise<boolean> {
  try {
    // Check if the Clipboard API is available
    if (!navigator.clipboard) {
      console.error('Clipboard API is not available.');
      return false;
    }

    // Query for the "clipboard-read" permission
    const permissionStatus = await navigator.permissions.query({
      name: 'clipboard-read' as PermissionName,
    });

    // If the permission is 'prompt', it means we can request it directly
    if (permissionStatus.state === 'prompt') {
      // Request permission by trying to read from the clipboard
      try {
        await navigator.clipboard.readText(); // This prompts the user
        return true; // Assuming permission is granted after prompting
      } catch (error) {
        console.error('Clipboard read permission denied or failed:', error);
        return false;
      }
    }

    // Return true if permission is already granted, false otherwise
    return permissionStatus.state === 'granted';
  } catch (error) {
    console.error(
      'Error checking or requesting clipboard read permissions:',
      error
    );
    return false;
  }
}

interface PixKeyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onPasteSuccess?: () => void;
}

const PixKeyInput = ({
  disabled,
  onPasteSuccess,
  ...rest
}: PixKeyInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [clipboardText, setClipboardText] = useState('');

  useEffect(() => {
    console.log(
      "🚀 ~ useEffect ~ inputRef.current && clipboardText && clipboardText !== '':",
      inputRef.current,
      clipboardText,
      clipboardText !== ''
    );
    if (inputRef.current && clipboardText && clipboardText !== '') {
      inputRef.current.value = clipboardText;
    }
  }, [clipboardText]);

  const handlePaste = useCallback(() => {
    setTimeout(async () => {
      console.log('🚀 ~ setTimeout ~ setTimeout:');
      try {
        // Check and request clipboard read permissions
        const hasPermission = await checkAndRequestClipboardReadPermissions();
        if (hasPermission) {
          const text = await navigator.clipboard.readText();
          setClipboardText(text);
          onPasteSuccess?.(); // Llamar a la función onPasteSuccess si existe
          console.log('Text read from clipboard:', text);
        } else {
          toast.error('No permission to read from clipboard.');
        }
      } catch (error) {
        console.error('Failed to read text from clipboard:', error);
        toast.error('Failed to read text from clipboard.');
      }
    }, 150);
  }, [onPasteSuccess]);

  return (
    <div className="relative rounded-2xl shadow-sm text-xl">
      <input
        type="text"
        className="transition ease-in-out block w-full rounded-2xl border-0 p-4 pr-20 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400 read-only:ring-slate-300 appearance-none"
        readOnly={disabled}
        ref={inputRef}
        aria-label="Paste input"
        {...rest}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-50">
        <button
          type="button"
          className="text-pink-500 hover:text-pink-700 disabled:text-slate-400 text-base uppercase"
          onClick={handlePaste}
          disabled={disabled}
          aria-label="Paste button"
        >
          Paste
        </button>
      </div>
    </div>
  );
};

export default PixKeyInput;
