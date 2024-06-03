'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { type Address } from 'viem';

import { useAccount } from '@/lib/wagmi';
import { type TokenData, getTokensData } from '@/utils/getTokensData';

const UPDATE_INTERVAL = 1000 * 10; // 10 seconds in milliseconds
const BASE_CURRENCY = 'USD';

// Define the structure for currency rates
interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

// Define the WalletContext type
interface WalletContextType {
  userAddress?: Address;
  balances: Map<string, number>;
  balancesInCurrency: Map<string, number>;
  rates: Map<string, number>;
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  totalBalance: number;
}

// Create the WalletContext with a default value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Define a provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address: userAddress, isConnected } = useAccount();
  const [balances, setBalances] = useState<Map<string, number>>(new Map());
  const [balancesInCurrency, setBalancesInCurrency] = useState<
    Map<string, number>
  >(new Map());
  const [rates, setRates] = useState<Map<string, number>>(new Map());
  const [baseCurrency, setBaseCurrency] = useState<string>(BASE_CURRENCY);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  // Fetch currency rates from the API
  const fetchRates = useCallback(async (base: string) => {
    try {
      const response = await fetch(
        `https://api.temcrypto.com/v1/rates/${base}`,
        {
          next: { revalidate: 60 }, // Revalidate the cache every 60 seconds
          headers: {
            'User-Agent': 'TEMCRYPTO/1.0 (PWA; rv:42.0)',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch rates');
      }
      const { rates } = await response.json();
      const ratesMap: Map<string, number> = new Map(
        Object.entries(rates).map(([key, value]) => [
          key,
          parseFloat(value as string),
        ]),
      );

      setRates(ratesMap);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    }
  }, []);

  // Fetch balances from the Polygon RPC
  const fetchBalances = useCallback(async () => {
    if (!userAddress) return;
    try {
      const tokensData = await getTokensData({ address: userAddress });
      const newBalances = new Map<string, number>(
        tokensData.map((token: TokenData) => [token.symbol, token.balance]),
      );
      setBalances(newBalances);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  }, [userAddress]);

  // Update balancesInCurrency whenever balances or rates change
  useEffect(() => {
    if (balances.size === 0 || rates.size === 0) return;

    let totalBalance = 0;
    const newBalancesInCurrency = new Map<string, number>();

    balances.forEach((balance, symbol) => {
      const currencyRate = rates.get(symbol) ?? 1;
      const convertedBalance = balance / currencyRate;
      newBalancesInCurrency.set(symbol, convertedBalance);
      totalBalance += convertedBalance;
    });
    setBalancesInCurrency(newBalancesInCurrency);
    setTotalBalance(totalBalance);
  }, [balances, rates, baseCurrency]);

  // Update rates every UPDATE_INTERVAL seconds
  useEffect(() => {
    fetchRates(baseCurrency);
    const interval = setInterval(() => {
      fetchRates(baseCurrency);
    }, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [baseCurrency, fetchRates]);

  // Update balances when the user address or rates change
  useEffect(() => {
    if (isConnected && userAddress) {
      fetchBalances();
    }
  }, [isConnected, userAddress, rates, fetchBalances]);

  // Memoized context value to avoid unnecessary re-renders
  const contextValue: WalletContextType = useMemo(
    () => ({
      userAddress,
      balances,
      balancesInCurrency,
      rates,
      baseCurrency,
      setBaseCurrency,
      totalBalance,
    }),
    [
      userAddress,
      balances,
      balancesInCurrency,
      rates,
      baseCurrency,
      totalBalance,
    ],
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use the WalletContext
export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

/**
 * Use this component to wrap the part of your app that needs access to the wallet context.
 *
 * Example:
 *
 * <WalletProvider>
 *   <YourComponent />
 * </WalletProvider>
 */
export const WalletContextConsumer = WalletContext.Consumer;
