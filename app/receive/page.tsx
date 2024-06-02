'use client';

import PageWrapper from '@/components/PageWrapper';

// Regular Expression to Validate Currency Inputs from 5.00 up to 500.00

/*
Explanation:
- The regex is divided into two main parts by the OR operator (|), handling numbers less than 500 and exactly 500 differently.
- For numbers less than 500:
  - ^(?:[5-9]|[1-9]\d|[1-4]\d{2}): Matches numbers from 5 to 499, either as whole numbers or with decimal points.
  - (?:[.,]\d{1,2})?$: Optionally matches a decimal separator (period or comma) followed by one or two digits, allowing for values like "123.45".
- For the number 500:
  - ^(500)(?:[.,]0{1,2})?$: Specifically matches "500", with or without up to two trailing zeros after the decimal point, ensuring that values above 500.00, like "500.01", are not considered valid.
- This ensures precise validation of currency amounts from 5.00 to exactly 500.00, accommodating standard currency formats and correctly handling the upper limit.
*/
const AMOUNT_REGEX =
  /^(?:[5-9]|[1-9]\d|[1-4]\d{2})(?:[.,]\d{1,2})?$|^(500)(?:[.,]0{1,2})?$/;

export default function Receive() {
  return (
    <PageWrapper id="page-receive" requireSession={true}>
      <div className="mb-8">
        <p className="text-xl text-slate-500">
          Enter the amount you want to charge.
        </p>
      </div>

      <form>
        <div className="relative mt-8 rounded-2xl text-xl">
          <input
            type="text"
            inputMode="decimal"
            className="peer block w-full appearance-none rounded-2xl border-0 p-4 pl-12 text-slate-800 ring ring-slate-200 transition ease-in-out placeholder:text-slate-400 read-only:bg-slate-300 read-only:text-slate-400 read-only:ring-slate-300 focus:outline-none focus:ring-pink-500 invalid:focus:bg-red-100 invalid:focus:text-red-500 invalid:focus:ring-red-500 read-only:focus:ring-slate-300"
            id="amount"
            name="amount"
            aria-label="Enter the transaction amount between 5,00 and 500,00"
            placeholder="5,00 - 500,00"
            // value={formattedAmount}
            pattern={AMOUNT_REGEX.source}
            // onChange={handleAmountChange}
            required={true}
            readOnly={false}
          />
          <div
            className={
              'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-800 transition ease-in-out peer-invalid:text-slate-400 peer-read-only:text-slate-400 peer-invalid:peer-focus:text-red-500'
            }
          >
            R$
          </div>
        </div>

        <input
          type="submit"
          className="mt-8 w-full rounded-2xl bg-pink-500 p-4 text-center text-xl text-white"
          value="Continue"
        />
      </form>
    </PageWrapper>
  );
}
