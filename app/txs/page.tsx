'use client';

import PageWrapper from '@/components/PageWrapper';
import { useDynamicContext } from '@/lib/dynamicxyz';
import { FormEventHandler, useState } from 'react';
import {
  Account,
  Chain,
  Hex,
  PublicClient,
  Transport,
  WalletClient,
  parseEther,
} from 'viem';

import { getChain } from '@dynamic-labs/utils';

export default function Tx() {
  const { primaryWallet } = useDynamicContext();

  const [txnHash, setTxnHash] = useState('');

  if (!primaryWallet) return null;

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const address = formData.get('address') as string;
    const amount = formData.get('amount') as string;
    const provider = await primaryWallet.connector.getSigner<
      WalletClient<Transport, Chain, Account>
    >();

    if (!provider) return;

    // const balance = await provider.getBalance(wallet.address);
    // console.log('balance', balance.toString());

    const transaction = {
      account: primaryWallet.address as Hex,
      chain: getChain(await provider.getChainId()),
      to: address as Hex,
      value: amount ? parseEther(amount) : undefined,
      // address:
    };

    const hash = await provider.sendTransaction(transaction);

    const client =
      await primaryWallet.connector.getPublicClient<PublicClient>();

    const { transactionHash } = await client.getTransactionReceipt({
      hash,
    });
    setTxnHash(transactionHash);
  };

  const signMessage = async () => {
    if (!primaryWallet) return;

    const signer = await primaryWallet.connector.getSigner();

    if (!signer) return;

    // const signature = await signer.signMessage('example');

    console.log('signature ~ signer', signer);
  };

  return (
    <PageWrapper requireSession={true}>
      <form onSubmit={onSubmit}>
        <p>Send to ETH address</p>
        <input name="address" type="text" required placeholder="Address" />
        <input name="amount" type="text" required placeholder="0.05" />
        <button type="submit">Send</button>
        <span data-testid="transaction-section-result-hash">{txnHash}</span>
      </form>

      <button onClick={signMessage}>Sign message</button>
    </PageWrapper>
  );
}
