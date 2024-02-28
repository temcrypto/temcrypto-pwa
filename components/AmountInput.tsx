'use client';

import { useRef, useEffect, type InputHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

const AmountInput = ({
  autoFocus,
  readOnly,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) => {
  const { pending } = useFormStatus();

  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (amountRef.current && !readOnly && autoFocus) {
      amountRef.current.focus();
    }
  }, [readOnly, autoFocus]);

  return (
    <div className="relative mt-8 rounded-2xl shadow-sm text-xl">
      <input
        type="text"
        inputMode="decimal"
        ref={amountRef}
        className="transition ease-in-out block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none appearance-none read-only:ring-slate-300 read-only:focus:ring-slate-300 read-only:bg-slate-300 read-only:text-slate-400 invalid:focus:ring-red-500 invalid:focus:text-red-500 invalid:focus:bg-red-100 peer"
        autoFocus={autoFocus}
        readOnly={readOnly || pending}
        {...rest}
      />
      <div
        className={
          'transition ease-in-out pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-800  peer-invalid:text-slate-400 peer-invalid:peer-focus:text-red-500 peer-read-only:text-slate-400'
        }
      >
        R$
      </div>
    </div>
  );
};

export default AmountInput;
