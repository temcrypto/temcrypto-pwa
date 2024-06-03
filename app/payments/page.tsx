'use client';

import PageWrapper from '@/components/PageWrapper';
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import Image from 'next/image';
import { CgCloseO } from 'react-icons/cg';
import { FaPix } from 'react-icons/fa6';
import { TbGasStation } from 'react-icons/tb';
import { QrReader } from 'react-qr-reader';
import { useDebounce } from 'use-debounce';
import { type Address, isAddress, parseEther, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import {
  type GetEnsAddressReturnType,
  type GetEnsAvatarReturnType,
  type GetEnsNameReturnType,
  normalize,
} from 'viem/ens';

import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Spinner } from '@/components/Loading';
import TokenItem from '@/components/TokenItem';
import { useWalletContext } from '@/context/wallet-context';
import {
  estimateGas,
  getEnsAddress,
  getEnsAvatar,
  getEnsName,
  wagmiConfig,
  wagmiConfigMainnet,
} from '@/lib/wagmi';
import randomEmoji from '@/utils/randomEmoji';
import shortenAddress from '@/utils/shortenAddress';
import supportedTokensList from '@/utils/tokenList';

import { fetchPixKeyData } from './actions';

// Regex to test if the textTrim is an ENS name ending on '.eth'
const ENS_REGEX = /^[a-zA-Z0-9]{1,253}\.eth$/;

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
const BRL_AMOUNT_REGEX =
  /^(?:[5-9]|[1-9]\d|[1-4]\d{2})(?:[.,]\d{1,2})?$|^(500)(?:[.,]0{1,2})?$/;

// Regular Expression to Validate Crypto Currency Amounts
/*
Description:
This regular expression is designed to validate crypto currency values with different decimal precision requirements for regular cryptocurrencies and stablecoins. It supports both period (.) and comma (,) as decimal separators to accommodate English and Spanish keyboard layouts.

Regular Cryptocurrencies:
- Allows values with up to 18 digits before the decimal separator.
- Allows up to 8 decimal places after the decimal separator.
- Accepts values like: 12.34567890, 12,34567890, 0.00000001, 0,00000001, 123456789012345.67890000, 123456789012345,67890000

Stablecoins:
- Allows values with up to 6 digits before the decimal separator.
- Allows up to 2 decimal places after the decimal separator.
- Accepts trailing zeros (up to 6) after the decimal places.
- Accepts values like: 12.34, 12,34, 0.01, 0,01, 123.45000000, 123,45000000

Pattern:
^                          # Start of string
(?:                        # Non-capturing group for alternatives
  (?:0|[1-9]\d{0,17})      # Match regular cryptocurrencies
  (?:[.,]\d{1,8})?         # Optional decimal part with 1 to 8 digits, allowing period or comma as separator
|                          # OR
  (?:0|[1-9]\d{0,5})       # Match stablecoins
  (?:[.,]\d{1,2})?         # Optional decimal part with 1 or 2 digits, allowing period or comma as separator
  0{0,6}                   # Match up to 6 trailing zeros
)
$                          # End of string

This regular expression ensures precise validation of crypto currency amounts by separating the requirements for regular cryptocurrencies and stablecoins, allowing for different decimal precision requirements while maintaining a consistent format. It also supports both period (.) and comma (,) as decimal separators to accommodate English and Spanish keyboard layouts.
*/
const CRYPTO_AMOUNT_REGEX =
  /^(?:(?:0|[1-9]\d{0,17})(?:[.,]\d{1,8})?|(?:0|[1-9]\d{0,5})(?:[.,]\d{1,2})?0{0,6})$/;

// Fetch ENS data from Mainnet
const fetchEnsData = async (
  ensName: string,
): Promise<{
  address: GetEnsAddressReturnType;
  avatar: GetEnsAvatarReturnType;
  name: GetEnsNameReturnType;
}> => {
  try {
    const chainId = mainnet.id;
    const name = normalize(ensName);
    return Promise.all([
      getEnsAddress(wagmiConfigMainnet, { name, chainId }),
      getEnsAvatar(wagmiConfigMainnet, { name, chainId }),
    ]).then(([address, avatar]) => {
      console.log('ENS data', { name, address, avatar });
      return { address, avatar, name };
    });
  } catch (error) {
    console.log('Error fetching ENS data', error);
    throw new Error('InvalidENSName');
  }
};

const fetchAddrsData = async (
  address: Address,
): Promise<{
  address: GetEnsAddressReturnType;
  avatar: GetEnsAvatarReturnType;
  name: GetEnsNameReturnType;
}> => {
  try {
    let avatar = null;
    const chainId = mainnet.id;
    const name = await getEnsName(wagmiConfigMainnet, { address, chainId });
    if (name) {
      avatar = await getEnsAvatar(wagmiConfigMainnet, { name, chainId });
      console.log('Address data', { name, address, avatar });
    }
    return { address, avatar, name };
  } catch (error) {
    console.log('Error fetching EVM address data', error);
    throw new Error('InvalidEVMAddress');
  }
};

type ReceiverData = {
  avatar?: string | null;
  alias?: string | null;
  name: string | null;
  type: 'crypto' | 'pix' | null;
  loading: boolean;
};

const initialReceiverData: ReceiverData = {
  name: null,
  type: null,
  loading: false,
};

type PaymentData = {
  currency: string | null;
  amount: number;
  loading: boolean;
};

const initialPaymentData: PaymentData = {
  currency: null,
  amount: 0,
  loading: false,
};

export default function Payments() {
  const { baseCurrency, rates, userAddress } = useWalletContext();
  const [showQrReader, setShowQrReader] = useState(false);
  const [receiverData, setReceiverData] = useState(initialReceiverData);
  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [formattedCurrency, setFormattedCurrency] = useState('');
  const [amountInCurrency, setAmountInCurrency] = useState('');
  const [receiverText, setReceiverText] = useState('');
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);
  const [receiverStr] = useDebounce(receiverText, 300);

  const receiverInputRef = useRef<HTMLInputElement>(null);
  const currencyInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const handleScan = useCallback(() => {
    console.log('scan');
  }, []);

  const handleCurrencyChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const textTrim = e.target.value.trim();
      setFormattedCurrency(textTrim ?? '');
    },
    [],
  );

  // Validate and update amount
  const handleBrlAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const isValid = BRL_AMOUNT_REGEX.test(inputValue);
      if (isValid) {
        const amountWithPeriod = inputValue.replace(',', '.');
        const amountSafe = parseFloat(amountWithPeriod);
        setPaymentData((prevState) => ({ ...prevState, amount: amountSafe }));
      }
      setFormattedAmount(inputValue ?? ''); // Update the formatted amount state to show in the UI
    },
    [],
  );

  const handleCryptoAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const amountWithPeriod = inputValue.replace(',', '.');
      const amountSafe = parseFloat(amountWithPeriod);
      setPaymentData((prevState) => ({ ...prevState, amount: amountSafe }));
      setFormattedAmount(inputValue ?? ''); // Update the formatted amount state to show in the UI
    },
    [],
  );

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('submit', receiverData.type, receiverStr);
      if (receiverData.type === null && receiverStr.length >= 3) {
        console.log('no type. search for pix data', receiverStr);
        setReceiverData((prevState) => ({ ...prevState, loading: true }));
        const { name, pixKeyParsed } = await fetchPixKeyData(receiverStr);
        if (name && pixKeyParsed) {
          setReceiverData((prevState) => ({
            ...prevState,
            type: 'pix',
            name,
            alias: pixKeyParsed,
            loading: false,
          }));
          setPaymentData((prevState) => ({ ...prevState, currency: 'BRL' }));
          if (amountInputRef.current) {
            amountInputRef.current.focus();
          }
        }
      }
    },
    [receiverData.type, receiverStr],
  );

  useEffect(() => {
    const fetchReceiverData = async () => {
      console.log('useEffect ~ fetchReceiverData', receiverStr);

      // Check if the input is an ENS name and if so, get the ENS data and update the state
      if (ENS_REGEX.test(receiverStr)) {
        setReceiverData((prevState) => ({ ...prevState, loading: true }));
        const { avatar, address, name } = await fetchEnsData(receiverStr);
        setReceiverData((prevState) => ({
          ...prevState,
          name,
          avatar,
          alias: address,
          type: address ? 'crypto' : null,
          loading: false,
        }));
        if (currencyInputRef.current) {
          currencyInputRef.current.focus();
        }
        // Check if the input is an address and if so, get the ENS data and update the state
      } else if (isAddress(receiverStr)) {
        setReceiverData((prevState) => ({ ...prevState, loading: true }));
        const { avatar, address, name } = await fetchAddrsData(receiverStr);
        setReceiverData((prevState) => ({
          ...prevState,
          name,
          avatar,
          alias: address,
          type: address ? 'crypto' : null,
          loading: false,
        }));
        if (currencyInputRef.current) {
          currencyInputRef.current.focus();
        }
      }
    };

    // If the length of the input is greater than 3
    if (receiverStr.length >= 3) {
      fetchReceiverData();
    }
  }, [receiverStr]);

  useEffect(() => {
    const fetchEstimatedGas = async () => {
      try {
        setEstimatedGas(null);
        const result = await estimateGas(wagmiConfig, {
          account: userAddress,
          to: receiverData.alias as Address,
          value: parseEther(paymentData.amount.toFixed(8)),
        });
        if (result) {
          setEstimatedGas(formatUnits(result, 8));
        }
      } catch (error) {
        console.log('Error in estimate gas', error);
      }
    };
    if (
      receiverData.type === 'crypto' &&
      receiverData.alias &&
      paymentData.amount
    ) {
      fetchEstimatedGas();
    }
  }, [receiverData.type, receiverData.alias, paymentData.amount, userAddress]);

  useEffect(() => {
    if (paymentData.currency) {
      const currencyRate = rates.get(paymentData.currency) ?? 1;
      const amountSafe = paymentData.amount ?? 0;
      const amount = (amountSafe / currencyRate).toFixed(2);
      setAmountInCurrency(amount);
    }
  }, [paymentData.currency, paymentData.amount, rates]);

  return (
    <PageWrapper id="page-payments" requireSession={true}>
      {/* <div className="mb-8">
        <p className="text-xl text-slate-500">
          Scan a QR code or enter a Chave Pix: CPF, CNPJ, phone number, or
          email.
        </p>
      </div> */}

      {showQrReader ? (
        <div className="animate-bounce-from-bottom">
          <QrReader
            constraints={{
              aspectRatio: 1,
              facingMode: 'environment',
            }}
            scanDelay={500}
            onResult={handleScan}
            ViewFinder={() => (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                }}
              ></div>
            )}
            videoContainerStyle={{
              position: 'relative',
              padding: 0,
              margin: '0 auto',
              border: '4px solid rgb(236, 72, 153)',
              borderRadius: '1.5rem',
              height: '300px',
              width: '300px',
            }}
            videoStyle={{
              zIndex: -100,
            }}
          />
          <button
            type="button"
            className="mt-6 w-full p-4"
            onClick={() => setShowQrReader(false)}
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleFormSubmit}
            className="w-full animate-bounce-from-bottom"
          >
            <div className="ml-2 text-xl text-slate-500">To</div>
            <div className="flex h-20 flex-row items-center rounded-3xl bg-slate-700/60 p-4">
              {receiverData.loading ? (
                <LoadingSkeleton className="me-3 h-10 w-10 !rounded-full" />
              ) : (
                <div className="me-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-600">
                  {receiverData.type === 'pix' && (
                    <FaPix className="h-10 w-10 rounded-full bg-white p-[5px] text-[#32BCAD]" />
                  )}
                  {receiverData.type === 'crypto' && (
                    <>
                      {receiverData.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={receiverData.avatar}
                          alt={receiverData.name ?? 'Avatar'}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                          {randomEmoji()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="flex-1">
                <div className="font-extrabold">
                  {receiverData.type && receiverData.name
                    ? receiverData.name
                    : (receiverData.alias &&
                        shortenAddress(receiverData.alias, 6)) ?? (
                        <input
                          id="receiver"
                          name="receiver"
                          type="text"
                          ref={receiverInputRef}
                          className="w-full border-none bg-transparent pr-2 text-slate-400 caret-pink-500 outline-none placeholder:text-sm placeholder:text-slate-400 focus:outline-none"
                          aria-label="Enter a Chave Pix, ENS name or Wallet Address"
                          placeholder="Chave Pix, Wallet Address or ENS"
                          value={
                            isAddress(receiverText)
                              ? shortenAddress(receiverText, 6)
                              : receiverText
                          }
                          onChange={(e) => {
                            setReceiverText(e.target.value.trim());
                          }}
                          required={true}
                          readOnly={receiverData.loading}
                          autoFocus={true}
                          autoComplete="off"
                        />
                      )}
                </div>
                <>
                  {receiverData.name && receiverData.alias && (
                    <div className="animate-bounce-from-bottom text-sm text-slate-400">
                      {isAddress(receiverData.alias)
                        ? shortenAddress(receiverData.alias, 8)
                        : receiverData.alias}
                    </div>
                  )}
                </>
              </div>

              <div className="flex items-center">
                {receiverData.loading ? (
                  <Spinner />
                ) : (
                  receiverData.type && (
                    <button
                      type="button"
                      className="text-2xl text-slate-200 active:scale-95"
                      onClick={() => {
                        setReceiverData(initialReceiverData);
                        setPaymentData(initialPaymentData);

                        // Reset inputs
                        setFormattedCurrency('');
                        setFormattedAmount('');
                        setReceiverText('');

                        // Focus on input again
                        if (receiverInputRef.current) {
                          receiverInputRef.current.focus();
                        }
                      }}
                    >
                      <CgCloseO />
                    </button>
                  )
                )}
              </div>
            </div>

            {receiverData.type && (receiverData.name || receiverData.alias) && (
              <>
                <div className="ml-2 mt-4 text-xl text-slate-500">Send</div>
                <div className="flex min-h-20 animate-bounce-from-bottom flex-row items-center rounded-3xl bg-slate-700/60 p-4">
                  <div className="me-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-600">
                    {paymentData.currency && (
                      <Image
                        src={
                          paymentData.currency === 'BRL'
                            ? '/images/flags/brazil.png'
                            : `/images/tokens/${paymentData.currency.toLowerCase()}.svg`
                        }
                        alt={paymentData.currency}
                        width={40}
                        height={40}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-extrabold">
                      {paymentData.currency === null ? (
                        <input
                          type="text"
                          ref={currencyInputRef}
                          className="w-full border-none bg-transparent pr-2 caret-pink-500 outline-none placeholder:text-sm focus:outline-none"
                          id="currency"
                          name="currency"
                          aria-label="Select the Currency or Token to send"
                          placeholder="Select the Currency or Token"
                          value={formattedCurrency}
                          onChange={handleCurrencyChange}
                          required={receiverData.type !== null}
                          disabled={receiverData.type === null}
                          autoFocus={true}
                          autoComplete="off"
                        />
                      ) : (
                        <>
                          {paymentData.currency === 'BRL' ? (
                            <div className="relative">
                              <input
                                type="text"
                                inputMode="decimal"
                                ref={amountInputRef}
                                className="peer block w-full border-none bg-transparent pl-8 caret-pink-500 outline-none transition ease-in-out focus:outline-none invalid:focus:text-rose-500"
                                id="amountBrl"
                                name="amountBrl"
                                aria-label="Enter the amount to pay. It must be between 5,00 and 500,00"
                                placeholder="5,00 - 500,00"
                                value={formattedAmount}
                                pattern={BRL_AMOUNT_REGEX.source}
                                onChange={handleBrlAmountChange}
                                required={receiverData.type !== null}
                                autoFocus={true}
                                autoComplete="off"
                              />
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-white transition ease-in-out peer-invalid:text-rose-500 peer-read-only:text-slate-400">
                                R$
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                inputMode="decimal"
                                ref={amountInputRef}
                                className="peer block w-full border-none bg-transparent caret-pink-500 outline-none transition ease-in-out focus:outline-none invalid:focus:text-rose-500"
                                id="amountCrypto"
                                name="amountCrypto"
                                aria-label="Enter the amount to pay"
                                placeholder="Amount to pay"
                                value={formattedAmount}
                                pattern={CRYPTO_AMOUNT_REGEX.source}
                                onChange={handleCryptoAmountChange}
                                required={receiverData.type !== null}
                                autoFocus={true}
                                autoComplete="off"
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 mr-4 flex items-center text-white transition ease-in-out peer-invalid:text-rose-500 peer-read-only:text-slate-400">
                                {paymentData.currency}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {formattedAmount &&
                      paymentData.currency === 'BRL' &&
                      paymentData.amount > 0 && (
                        <div className="animate-bounce-from-bottom text-sm text-slate-400">
                          ≈ {amountInCurrency} {baseCurrency}
                        </div>
                      )}

                    {formattedAmount &&
                      paymentData.currency &&
                      paymentData.currency !== 'BRL' &&
                      paymentData.amount > 0 && (
                        <div className="animate-bounce-from-bottom text-sm text-slate-400">
                          ≈ {amountInCurrency} {baseCurrency}
                        </div>
                      )}
                  </div>

                  {paymentData.currency && (
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="text-2xl text-slate-200 active:scale-95"
                        onClick={() => {
                          setPaymentData((prevState) => ({
                            ...prevState,
                            currency:
                              paymentData.currency === 'BRL' ? 'BRL' : null,
                            amount: 0,
                          }));
                          setFormattedAmount('');
                          setFormattedCurrency('');
                          if (amountInputRef.current) {
                            amountInputRef.current.focus();
                          }
                        }}
                      >
                        <CgCloseO />
                      </button>
                    </div>
                  )}
                </div>

                {receiverData.type === 'crypto' && paymentData.amount > 0 && (
                  <div className="ml-2 mt-2 flex animate-bounce-from-bottom flex-row items-center text-slate-500">
                    <TbGasStation />
                    <div className="ml-1 flex flex-row items-center text-sm">
                      estimated gas:
                      <span className="ml-1">
                        {estimatedGas === null ? (
                          <LoadingSkeleton className="h-[10px] w-16" />
                        ) : (
                          estimatedGas
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {receiverData.type === 'crypto' &&
                  paymentData.currency === null && (
                    <div className="mt-4">
                      <h2 className="mb-2 ml-1 mt-4 text-xl font-bold text-slate-500">
                        Tokens
                      </h2>
                      <div className="flex animate-bounce-from-bottom flex-col space-y-3 overflow-y-scroll *:h-20 *:rounded-3xl *:bg-slate-700/60 *:p-4">
                        {supportedTokensList
                          .filter(({ name }) =>
                            name
                              .toLowerCase()
                              .includes(formattedCurrency.toLowerCase()),
                          )
                          .map((token) => (
                            <TokenItem
                              key={token.address}
                              token={token}
                              onClick={() => {
                                setPaymentData((prevState) => ({
                                  ...prevState,
                                  currency: token.symbol,
                                }));
                                if (amountInputRef.current) {
                                  amountInputRef.current.focus();
                                }
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  )}
              </>
            )}

            <button
              type="submit"
              className={`mt-8 w-full cursor-pointer appearance-none rounded-3xl border-[.2rem] border-pink-500 bg-pink-500 p-4 text-center text-white transition ease-in-out active:border-pink-700 active:bg-pink-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-400 ${
                (receiverData.loading || paymentData.loading) && 'animate-pulse'
              }`}
              disabled={
                receiverData.loading ||
                (receiverData.type !== null && paymentData.amount === 0) ||
                receiverText === '' ||
                receiverData.name == ''
              }
            >
              {receiverData.loading || paymentData.loading
                ? 'Loading...'
                : 'Continue'}
            </button>
          </form>
        </>
      )}
    </PageWrapper>
  );
}
