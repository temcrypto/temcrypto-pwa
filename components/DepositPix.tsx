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

export default function DepositPix() {
  return (
    <div className="flex flex-col items-center animate-bounce-from-bottom">
      <div className="text-xl mb-6">Deposit Pix</div>
      <form>
        <div className="relative rounded-2xl text-xl">
          <input
            type="text"
            inputMode="decimal"
            className="transition ease-in-out block w-full rounded-2xl border-0 p-4 pl-12 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400 read-only:ring-slate-300 read-only:focus:ring-slate-300 invalid:focus:ring-red-500 invalid:focus:text-red-500 invalid:focus:bg-red-100 peer appearance-none"
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
              'transition ease-in-out pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-800  peer-invalid:text-slate-400 peer-invalid:peer-focus:text-red-500 peer-read-only:text-slate-400'
            }
          >
            R$
          </div>
        </div>

        <input
          type="submit"
          className="w-full bg-pink-500 rounded-2xl p-4 text-center text-white text-xl mt-8"
          value="Continue"
        />
      </form>
    </div>
  );
}
