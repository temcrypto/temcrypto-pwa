'use client';

import PageWrapper from '@/components/PageWrapper';
import { FormEventHandler, useEffect, useState } from 'react';
import {
  Account,
  Chain,
  Hex,
  PublicClient,
  Transport,
  WalletClient,
  parseEther,
} from 'viem';

import {
  EmbeddedWalletIcon,
  useDynamicContext,
  useFunding,
  useIsLoggedIn,
} from '@/lib/dynamicxyz';
import { getChain } from '@dynamic-labs/utils';

export default function Tx() {
  const { primaryWallet, rpcProviders } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  console.log('isLoggedIn', isLoggedIn);

  const { enabled, openFunding } = useFunding();
  console.log('openFunding enabled', enabled);

  const [txnHash, setTxnHash] = useState('');
  const [balance, setBalance] = useState<string | undefined>();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const address = formData.get('address') as string;
    const amount = formData.get('amount') as string;
    const provider =
      await primaryWallet?.connector.getSigner<
        WalletClient<Transport, Chain, Account>
      >();

    if (!provider) return;

    // const balance = await provider.getBalance(wallet.address);
    // console.log('balance', balance.toString());

    const transaction = {
      account: primaryWallet?.address as Hex,
      chain: getChain(await provider.getChainId()),
      to: address as Hex,
      value: amount ? parseEther(amount) : undefined,
      // address:
    };

    const hash = await provider.sendTransaction(transaction);

    const client =
      await primaryWallet?.connector.getPublicClient<PublicClient>();

    const { transactionHash } = await client!.getTransactionReceipt({
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

  const mainnetProvider = rpcProviders.evmDefaultProvider?.provider;
  console.log('mainnetProvider ~ ', mainnetProvider);

  console.log('primaryWallet connector key ~ ', primaryWallet?.connector?.key);
  // const ensAddress = mainnetProvider?.resolveName('myname.eth');
  // console.log('address for myname.eth', ensAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      if (primaryWallet) {
        const value = await primaryWallet.connector.getBalance();
        console.log('balance ~ value', value);
        setBalance(value);
      }
    };
    fetchBalance();
  }, [primaryWallet]);

  if (!primaryWallet) return null;

  return (
    <PageWrapper requireSession={true}>
      <p>{balance}</p>

      <EmbeddedWalletIcon walletKey={primaryWallet?.connector?.key} />

      <hr />

      <div>
        {enabled && (
          <button className="onramp-button" onClick={() => openFunding}>
            Onramp
          </button>
        )}
      </div>

      <hr />

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
