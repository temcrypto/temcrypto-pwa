import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';
import { rangeDelay } from 'delay';
import toast from 'react-hot-toast';
import { LuQrCode } from 'react-icons/lu';

import { fetchPixKeyData, getSwapRateBrl } from '@/app/send/actions';
import {
  type PixPaymentState,
  usePixPaymentContext,
} from '@/context/PixPaymentContext';

import QRCodeScanner from './QRCodeScanner';

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

export default function PayPix() {
  const { pixPaymentState, setPixPaymentState } = usePixPaymentContext();
  const [openQrScanner, setOpenQrScanner] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [amountInputReadOnly, setAmountInputReadOnly] = useState(true);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  // Form helpers
  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault(); // Prevent default form submission
        setPixPaymentState((prevState) => ({ ...prevState, loading: true }));

        if (!pixPaymentState.pixKey || !pixPaymentState.amountBrl) {
          throw new Error('Invalid pixKey or amountBrl');
        }

        const [pixKeyData, swapRates] = await Promise.all([
          fetchPixKeyData(pixPaymentState.pixKey),
          getSwapRateBrl(pixPaymentState.amountBrl),
        ]);

        console.log('🚀 ~ handleFormSubmit ~ pixKeyData:', pixKeyData);
        console.log(
          '🚀 ~ handleFormSubmit ~ swapRates:',
          swapRates,
          pixPaymentState.amountBrl
        );

        // TODO: remove test delay
        await rangeDelay(1000, 5000);

        setPixPaymentState((prevState) => ({
          ...prevState,
          ...({
            name: pixKeyData.name,
            pixKeyParsed: pixKeyData.pixKeyParsed,
            amountBrl: swapRates.amountBrl,
            amountUsdt: swapRates.amountUsdt,
            rateUsdtBrl: swapRates.rateUsdtBrl,
            loading: false,
          } as PixPaymentState),
        }));

        setOpenPreview(true);
      } catch (err) {
        console.error('handleFormSubmit error:', err);
        toast.error("Can't submit the form. Please try again.");
      } finally {
        setPixPaymentState((prevState) => ({ ...prevState, loading: false }));
      }
    },
    [setPixPaymentState, pixPaymentState.amountBrl, pixPaymentState.pixKey]
  );

  // QRCodeScanner helpers
  const handleQrScan = useCallback(
    async (text: string) => {
      try {
        // Validate scanned text
        if (openQrScanner && text !== '') {
          const pixKeyData = await fetchPixKeyData(text);
          console.log(
            '🚀 ~ handleQrScan ~ pixKeyData:',
            pixKeyData,
            openQrScanner
          );

          let amountRateObj = {};
          if (pixKeyData.amount) {
            const swapRates = await getSwapRateBrl(pixKeyData.amount); // TODO: Validate and format the amount from KP
            console.log('🚀 ~ swapRates:', swapRates);

            amountRateObj = {
              amountBrl: pixKeyData.amount,
              amountUsdt: swapRates.amountUsdt,
              rateUsdtBrl: swapRates.rateUsdtBrl,
              // timeout: swapRates.timeout,
            };
          }

          setPixPaymentState((prevState) => ({
            ...prevState,
            ...({
              name: pixKeyData.name,
              pixKey: pixKeyData.pixKey,
              pixKeyParsed: pixKeyData.pixKeyParsed,
            } as PixPaymentState),
            ...(amountRateObj as PixPaymentState),
          }));

          // Open preview sheet if we have all the necessary info
          if (!!(pixKeyData.amount && pixKeyData.pixKeyParsed)) {
            setOpenPreview(true);
          }
        }
      } catch (err) {
        console.error('handleQrScan ~ err:', err);
        toast.error("Can't fetch the Pix Key data. Plase try again."); // TODO: Improve UI error messages
      } finally {
        setOpenQrScanner(false);
        console.log('🚀 ~ setOpenQrScanner: finally', openQrScanner);
      }
    },
    [setPixPaymentState, openQrScanner]
  );

  // Update PixKey in context when the input changes
  const handlePixKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const textTrim = e.target.value.trim();
      setAmountInputReadOnly(textTrim === ''); // Set amountInputReadOnly based on the presence of textTrim
      setPixPaymentState((prevState) => ({ ...prevState, pixKey: textTrim }));
    },
    [setPixPaymentState]
  );

  // Validate and update amount
  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const isValid = AMOUNT_REGEX.test(inputValue);
      const amountWithPeriod = inputValue.replace(',', '.');
      const amountSafe = parseFloat(amountWithPeriod);
      const amountBrl = isNaN(amountSafe) ? 0 : amountSafe;

      setFormattedAmount(inputValue); // Update the formatted amount state to show in the UI
      setPixPaymentState((prevState) => ({
        ...prevState,
        amountBrl,
      }));
      setCanSubmit(isValid);
    },
    [setPixPaymentState]
  );

  return (
    <div className="flex flex-col items-center animate-bounce-from-bottom text-xl">
      <div className="mb-6">Pay Pix</div>
      <p className="text-slate-400 text-pretty mb-8">
        Enter a Chave Pix such as CPF, CNPJ, phone number, or email.
      </p>
      <form onSubmit={handleFormSubmit} className="w-full">
        <div className="relative">
          <input
            id="pixKey"
            name="pixKey"
            type="text"
            className="transition ease-in-out w-full rounded-3xl p-4 pr-24 border-[.2rem] border-slate-300 focus:border-pink-400 text-slate-800 placeholder:text-slate-400 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400"
            aria-label="Enter Chave Pix such as CPF, CNPJ, phone number, or email"
            placeholder="CPF, phone number, email..."
            value={pixPaymentState.pixKeyParsed || pixPaymentState.pixKey}
            onChange={handlePixKeyChange}
            required={true}
            readOnly={pixPaymentState.loading}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex">
            <button
              type="button"
              className="text-pink-500 disabled:text-slate-400 text-base uppercase flex items-center"
              onClick={() => {
                if (!pixPaymentState.loading) setOpenQrScanner(true);
              }}
              disabled={pixPaymentState.loading}
              aria-label="Scan QR button"
            >
              <span className="mr-1 text-lg">
                <LuQrCode />
              </span>
              Scan
            </button>
          </div>
        </div>

        <div className="relative mt-8">
          <input
            type="text"
            inputMode="decimal"
            className="transition ease-in-out w-full rounded-3xl p-4 pl-12 border-[.2rem] border-slate-300 focus:border-pink-400 text-slate-800 placeholder:text-slate-400 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400 read-only:focus:border-slate-300 invalid:border-red-400 invalid:focus:border-red-400 invalid:focus:text-red-500 invalid:focus:bg-red-100 peer appearance-none"
            id="amount"
            name="amount"
            aria-label="Enter the transaction amount between 5,00 and 500,00"
            placeholder="5,00 - 500,00"
            value={formattedAmount}
            pattern={AMOUNT_REGEX.source}
            onChange={handleAmountChange}
            required={true}
            readOnly={
              amountInputReadOnly ||
              pixPaymentState.loading ||
              pixPaymentState.pixKey === ''
            }
          />
          <div
            className={
              'transition ease-in-out pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-800  peer-invalid:text-red-500 peer-read-only:text-slate-400'
            }
          >
            R$
          </div>
        </div>

        <button
          type="submit"
          className={`transition ease-in-out w-full rounded-3xl p-4 mt-8 border-[.2rem] border-pink-500 active:border-pink-700 text-center text-white bg-pink-500 active:bg-pink-700 disabled:text-slate-400 disabled:border-slate-300 disabled:bg-slate-300 cursor-pointer disabled:cursor-not-allowed appearance-none ${
            pixPaymentState.loading ? 'animate-pulse' : ''
          }`}
          disabled={!canSubmit || pixPaymentState.loading}
        >
          {pixPaymentState.loading ? 'Loading...' : 'Continue'}
        </button>
      </form>

      <QRCodeScanner
        isOpen={openQrScanner}
        onScan={handleQrScan}
        onClose={() => setOpenQrScanner(false)}
      />
    </div>
  );
}
