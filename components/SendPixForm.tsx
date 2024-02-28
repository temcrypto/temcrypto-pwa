'use client';

import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useState,
  useCallback,
  useEffect,
} from 'react';

import { submitPixPayment } from '@/app/actions';

import AmountInput from './AmountInput';
import PixKeyInput from './PixKeyInput';
import SendSubmitButton from './SendSubmitButton';

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
const amountRegex =
  /^(?:[5-9]|[1-9]\d|[1-4]\d{2})(?:[.,]\d{1,2})?$|^(500)(?:[.,]0{1,2})?$/;

interface SendPixFormProps extends InputHTMLAttributes<HTMLInputElement> {
  initialPixKey: string;
  onSubmit: (data: any) => void; // TODO: Fix typing
}

const SendPixForm = ({ initialPixKey, onSubmit }: SendPixFormProps) => {
  const [pixKey, setPixKey] = useState(initialPixKey);
  const [amountValue, setAmountValue] = useState('');
  const [amountAutoFocus, setAmountAutoFocus] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  // PixKey helpers
  const updatePixKey = useCallback(
    (text: string) => {
      if (typeof text === 'string') {
        const textTrim = text.trim();
        console.log(
          '🚀 ~ SendPixForm ~ textTrim !== pixKey:',
          textTrim !== pixKey,
          textTrim,
          pixKey
        );
        if (textTrim !== pixKey) {
          setPixKey(textTrim);
        }
      }
    },
    [pixKey]
  );

  const handlePixKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      console.log('🚀 ~ SendPixForm ~ text:', text);
      updatePixKey(text);
    },
    [updatePixKey]
  );

  const handlePixKeyPaste = useCallback(async () => {
    // TODO: `navigator.clipboard.readText()` without user interaction can be a security concern. Ensure you have proper permissions and user consent.
    const text = await navigator.clipboard.readText();
    updatePixKey(text);
    setAmountAutoFocus(true);
  }, [updatePixKey]);

  // AmountInput helpers
  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const canSubmit = amountRegex.test(inputValue);
    setAmountValue(inputValue); // Keep the original input value to preserve the user's decimal divisor choice
    setCanSubmit(canSubmit);
  }, []);

  useEffect(() => {
    console.log(
      '🚀 ~ useEffect ~ initialPixKey !== pixKey:',
      initialPixKey !== pixKey,
      `@@${initialPixKey}@@`,
      `--${pixKey}--`
    );
    if (initialPixKey && initialPixKey !== pixKey) {
      updatePixKey(initialPixKey);
      setAmountAutoFocus(true);
    }
  }, [initialPixKey, pixKey, updatePixKey]);

  return (
    <form
      action={async (formData) => {
        const pixPayment = await submitPixPayment(formData);
        onSubmit(pixPayment);
      }}
      className="mt-20"
    >
      <PixKeyInput
        id="pixKey"
        name="pixKey"
        aria-label="Enter Chave Pix such as CPF, CNPJ, phone number, or email"
        placeholder="CPF, phone number, email..."
        value={pixKey}
        onChange={handlePixKeyChange}
        required={true}
        onClickPaste={handlePixKeyPaste}
      />

      <AmountInput
        id="amount"
        name="amount"
        aria-label="Enter the transaction amount between 5.00 and 500.00"
        placeholder="5.00 - 500.00"
        value={amountValue}
        onChange={handleAmountChange}
        required={true}
        min={5}
        max={500}
        pattern={amountRegex.source}
        autoFocus={amountAutoFocus}
        readOnly={pixKey === ''}
      />

      <SendSubmitButton canSubmit={canSubmit} />
    </form>
  );
};

export default SendPixForm;
