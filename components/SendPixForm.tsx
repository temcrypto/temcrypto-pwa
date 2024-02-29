'use client';

import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import { submitPixPayment } from '@/app/actions';
import { useSendPixContext } from '@/context/SendPixContext';

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

interface SendPixFormProps {
  onSubmit: (data: any) => void; // Consider defining a more specific type for the data.
}

const SendPixForm = ({ onSubmit }: SendPixFormProps) => {
  const [amountAutoFocus, setAmountAutoFocus] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const { sendPixState, setSendPixState } = useSendPixContext();

  // Update PixKey in context
  const handlePixKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const textTrim = e.target.value.trim();
      if (textTrim !== sendPixState.pixKey) {
        setSendPixState((prevState) => ({ ...prevState, pixKey: textTrim }));
      }
    },
    [sendPixState.pixKey, setSendPixState]
  );

  const handlePixKeyPaste = useCallback(async () => {
    // Ensure to prompt the user before accessing clipboard
    const text = await navigator.clipboard.readText();
    setSendPixState((prevState) => ({ ...prevState, pixKey: text.trim() }));
    setAmountAutoFocus(true);
  }, [setSendPixState]);

  // Validate and update amount
  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const isValid = amountRegex.test(inputValue);
      setSendPixState((prevState) => ({ ...prevState, amount: inputValue }));
      setCanSubmit(isValid);
    },
    [setSendPixState]
  );

  // Handle form submission
  // const handleSubmit = useCallback(
  //   async (e: FormEvent) => {
  //     e.preventDefault(); // Prevent default form submission
  //     // setSendPixState((prevState) => ({ ...prevState, sending: true }));
  //     // const formData = { ...sendPixState }; // Prepare the data
  //     // const pixPayment = await submitPixPayment(formData);
  //     onSubmit(pixPayment); // Callback with the result
  //   },
  //   [sendPixState, onSubmit, setSendPixState]
  // );

  return (
    <form onSubmit={onSubmit} className="mt-20">
      <PixKeyInput
        id="pixKey"
        name="pixKey"
        aria-label="Enter Chave Pix such as CPF, CNPJ, phone number, or email"
        placeholder="CPF, phone number, email..."
        value={sendPixState.reformatedPixKey || sendPixState.pixKey}
        onChange={handlePixKeyChange}
        required={true}
        onClickPaste={handlePixKeyPaste}
        disabled={sendPixState.sending}
      />

      <AmountInput
        id="amount"
        name="amount"
        aria-label="Enter the transaction amount between 5.00 and 500.00"
        placeholder="5.00 - 500.00"
        value={sendPixState.amount}
        onChange={handleAmountChange}
        required={true}
        autoFocus={amountAutoFocus}
        readOnly={sendPixState.pixKey === ''}
        disabled={sendPixState.sending}
      />

      <SendSubmitButton canSubmit={canSubmit} disabled={sendPixState.sending} />
    </form>
  );
};

export default SendPixForm;
