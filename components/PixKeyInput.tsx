'use client';

import { type InputHTMLAttributes } from 'react';

interface PixKeyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClickPaste: () => void;
}

const PixKeyInput = ({ onClickPaste, disabled, ...rest }: PixKeyInputProps) => {
  return (
    <div className="relative rounded-2xl shadow-sm text-xl">
      <input
        type="text"
        className="transition ease-in-out block w-full rounded-2xl border-0 p-4 pr-20 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400 read-only:ring-slate-300 appearance-none"
        readOnly={disabled}
        {...rest}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <button
          type="button"
          className="text-pink-500 hover:text-pink-700 disabled:text-slate-400 text-base uppercase"
          onClick={onClickPaste}
          disabled={disabled}
        >
          Paste
        </button>
      </div>
    </div>
  );
};

export default PixKeyInput;
