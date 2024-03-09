'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

interface AmountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFocus?: () => void;
}

const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ value, readOnly, disabled, onFocus, ...rest }, ref) => {
    const amountRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => amountRef.current!,
      []
    );

    const focusInput = useCallback(() => {
      if (amountRef.current && !readOnly) {
        amountRef.current.focus();
        onFocus?.();
      }
    }, [readOnly, onFocus]);

    useEffect(() => {
      focusInput();
    }, [focusInput]);

    return (
      <div className="relative mt-8 rounded-2xl shadow-sm text-xl">
        <input
          type="text"
          inputMode="decimal"
          ref={amountRef}
          className="transition ease-in-out block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none appearance-none read-only:ring-slate-300 read-only:focus:ring-slate-300 read-only:bg-slate-300 read-only:text-slate-400 invalid:focus:ring-red-500 invalid:focus:text-red-500 invalid:focus:bg-red-100 peer"
          readOnly={readOnly || disabled}
          value={
            value
              ? value.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : ''
          }
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
  }
);

AmountInput.displayName = 'AmountInput';

export default AmountInput;

// const AmountInput = forwardRef<HTMLInputElement, AmountInputRefProps>(
//   ({ value, readOnly, disabled, onFocus, ...rest }, ref) => {
//     const amountRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//       if (ref) {
//         ref.current = amountRef.current;
//       }
//     }, [ref]);

//     const focusInput = useCallback(() => {
//       if (amountRef.current && !readOnly) {
//         amountRef.current.focus();
//         onFocus?.();
//       }
//     }, [readOnly, onFocus]);

//     useEffect(() => {
//       focusInput();
//     }, [focusInput]);

//     // const focusInput = useCallback(() => {
//     //   if (amountRef.current && !readOnly) {
//     //     amountRef.current.focus();
//     //     onFocus?.();
//     //   }
//     // }, [readOnly, onFocus]);

//     // useEffect(() => {
//     //   focusInput();
//     // }, [focusInput]);

//     // const focusInput = useCallback(() => {
//     //   console.log(
//     //     '🚀 ~ focusInput ~ focusInput',
//     //     amountRef.current,
//     //     readOnly,
//     //     autoFocus
//     //   );
//     //   if (amountRef.current && !readOnly && autoFocus) {
//     //     console.log(
//     //       '🚀 ~ focusInput ~ amountRef.current.focus:',
//     //       amountRef.current.focus
//     //     );
//     //     amountRef.current.focus();
//     //   }
//     // }, [readOnly, autoFocus]);

//     // useEffect(() => {
//     //   console.log('🚀 ~ useEffect ~ focusInput');
//     //   focusInput();
//     // }, [focusInput]);

//     return (
//       <div className="relative mt-8 rounded-2xl shadow-sm text-xl">
//         <input
//           type="text"
//           inputMode="decimal"
//           ref={amountRef}
//           className="transition ease-in-out block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none appearance-none read-only:ring-slate-300 read-only:focus:ring-slate-300 read-only:bg-slate-300 read-only:text-slate-400 invalid:focus:ring-red-500 invalid:focus:text-red-500 invalid:focus:bg-red-100 peer"
//           readOnly={readOnly || disabled}
//           value={
//             value
//               ? value.toLocaleString('pt-BR', {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : ''
//           }
//           {...rest}
//         />
//         <div
//           className={
//             'transition ease-in-out pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-800  peer-invalid:text-slate-400 peer-invalid:peer-focus:text-red-500 peer-read-only:text-slate-400'
//           }
//         >
//           R$
//         </div>
//       </div>
//     );
//   }
// );

// AmountInput.displayName = 'AmountInput';

// export default AmountInput;
