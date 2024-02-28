'use client';

import { type InputHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

interface SendSubmitButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  canSubmit: boolean;
}

const SendSubmitButton = ({ canSubmit }: SendSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`transition ease-in-out w-full bg-pink-500 rounded-2xl p-4 text-center text-white text-xl mt-8 cursor-pointer ring ring-pink-500 hover:bg-pink-600 hover:ring-pink-600 active:bg-pink-700 active:ring-pink-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:ring-slate-300 disabled:text-slate-400 ${
        pending ? 'animate-pulse' : ''
      }`}
      disabled={!canSubmit || pending}
    >
      {pending ? 'Sending...' : 'Continue'}
    </button>
  );
};

export default SendSubmitButton;
