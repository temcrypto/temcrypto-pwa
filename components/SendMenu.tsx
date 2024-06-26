import { type FC, useState, type FormEventHandler } from 'react';
import Image from 'next/image';
import { FaPix } from 'react-icons/fa6';

import { useDynamicContext, getChain } from '@/lib/dynamicxyz';

import {
  type Account,
  type Chain,
  type Hex,
  type Transport,
  type WalletClient,
  type PublicClient,
  parseEther,
} from 'viem';

type SendType = 'crypto' | 'pix' | null;

export const CryptoSendForm: FC = () => {
  const { primaryWallet } = useDynamicContext();

  const [txnHash, setTxnHash] = useState('');

  if (!primaryWallet) return null;

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const address = formData.get('address') as string;
    const amount = formData.get('amount') as string;
    const provider =
      await primaryWallet.connector.getSigner<
        WalletClient<Transport, Chain, Account>
      >();
    if (!provider) return;

    const transaction = {
      account: primaryWallet.address as Hex,
      chain: getChain(await provider.getChainId()),
      to: address as Hex,
      // value: amount ? parseEther(amount) : undefined,
      value: parseEther('0.001'),
    };

    const hash = await provider.sendTransaction(transaction);

    const client =
      await primaryWallet.connector.getPublicClient<PublicClient>();

    console.log('transaction', transaction);
    // console.log('hash', hash);

    // const { transactionHash } = await client.getTransactionReceipt({
    //   hash,
    // });
    // setTxnHash(transactionHash);
  };

  return (
    <form onSubmit={onSubmit}>
      <p>Send to ETH address</p>
      <input
        className="w-full text-slate-700"
        name="address"
        type="text"
        required
        placeholder="Address"
      />
      <input
        className="w-full text-slate-700"
        name="amount"
        type="text"
        required
        placeholder="0.05"
      />
      <button type="submit">Send</button>
      <span data-testid="transaction-section-result-hash">{txnHash}</span>
    </form>
  );
};

export default function SendMenu() {
  const [sendType, setSendType] = useState<SendType>(null);

  return (
    <>
      {sendType === null ? (
        <nav className="flex animate-bounce-from-bottom flex-col space-y-6">
          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setSendType('crypto');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-3xl">
                <Image
                  src="/images/networks/polygon.svg"
                  alt="Send using Crypto"
                  height={36}
                  width={36}
                />
              </div>
              <div className="ml-4">
                <div className="text-xl">Send using Crypto</div>
                <div className="text-sm font-light text-slate-400">
                  Send crypto assets to another account.
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setSendType('pix');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-3xl">
                <FaPix className="h-9 w-9 rounded-full bg-white p-[5px] text-[#32BCAD]" />
              </div>
              <div className="ml-4">
                <div className="text-xl">Send using Pix</div>
                <div className="text-sm font-light text-slate-400">
                  Send Reais using USDT from your account.
                </div>
              </div>
            </div>
          </button>
        </nav>
      ) : (
        <>
          {sendType === 'crypto' && <CryptoSendForm />}
          <button
            type="button"
            className="mt-4 flex w-full cursor-pointer items-center justify-center p-4 text-center"
            onClick={() => setSendType(null)}
          >
            Close
          </button>
        </>
      )}
    </>
  );
}
