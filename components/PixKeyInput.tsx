'use client';

import {
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface PixKeyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onPasteSuccess?: () => void;
}

const PixKeyInput = ({
  onPasteSuccess,
  disabled,
  ...rest
}: PixKeyInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isClipboardAPISupported, setIsClipboardAPISupported] = useState(false);
  const [clipboardText, setClipboardText] = useState('');

  useEffect(() => {
    setIsClipboardAPISupported(!!navigator.clipboard);
  }, []);

  useEffect(() => {
    console.log(
      "🚀 ~ useEffect ~ inputRef.current && clipboardText && clipboardText !== '':",
      inputRef.current && clipboardText && clipboardText !== '',
      inputRef.current,
      clipboardText,
      clipboardText !== ''
    );
    if (inputRef.current && clipboardText && clipboardText !== '') {
      console.log('🚀 ~ useEffect ~ clipboardText:', clipboardText);
      inputRef.current.value = clipboardText;
      // setClipboardText('');
      onPasteSuccess?.();
    }
  }, [clipboardText, onPasteSuccess]);

  const handlePaste = useCallback(async () => {
    console.log('🚀 ~ handlePaste ~ handlePaste');

    if (isClipboardAPISupported) {
      console.log(
        '🚀 ~ handlePaste ~ isClipboardAPISupported:',
        isClipboardAPISupported
      );

      try {
        const text = await navigator.clipboard.readText();
        setClipboardText(text);
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
      }
    } else {
      console.log('🚀 ~ handlePaste ~ inputRef.current:', inputRef.current);
      if (inputRef.current) {
        inputRef.current.focus();
        console.log('🚀 ~ handlePaste ~ inputRef.current.focus - paste');
        document.execCommand('paste');
      }
    }
  }, [isClipboardAPISupported]);

  return (
    <>
      <div className="relative rounded-2xl shadow-sm text-xl">
        <input
          type="text"
          className="transition ease-in-out block w-full rounded-2xl border-0 p-4 pr-20 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400 read-only:ring-slate-300 appearance-none"
          readOnly={disabled}
          ref={inputRef}
          aria-label="Paste input"
          {...rest}
        />
        {/* <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-50"></div> */}
      </div>
      <button
        type="button"
        className="text-pink-500 hover:text-pink-700 disabled:text-slate-400 text-base uppercase"
        onClick={handlePaste}
        disabled={disabled}
        aria-label="Paste button"
      >
        Paste
      </button>
    </>
  );
};

export default PixKeyInput;
