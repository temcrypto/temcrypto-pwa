// context/RatesContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { fetchRates } from '@/app/actions';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const UPDATE_INTERVAL = 1000 * 10; // 10 seconds

export interface Rate {
  code: string;
  rate: number;
}

interface RatesContextType {
  rates: Rate[];
  getRateForCode: (code: string) => Rate | undefined;
}

export const RatesContext = createContext<RatesContextType | undefined>(
  undefined
);

export const RatesProvider = ({
  children,
  rates: initialRates,
}: {
  children: React.ReactNode;
  rates: Rate[];
}) => {
  const [rates, setRates] = useState(initialRates);
  const { isAuthenticated } = useDynamicContext();

  const fetchRatesCb = useCallback(async () => {
    if (isAuthenticated) {
      const data = await fetchRates();
      console.log('RatesContext ~ fetchRates ~ data:', data);
      setRates(data);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = setInterval(fetchRatesCb, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRatesCb]);

  // Optimize performance and avoid unnecessary re-renders of the context consumers.
  // Memoize the rates array using useMemo
  const memoizedRates = useMemo(() => rates, [rates]);

  // Memoize the getRateForCode function
  const getRateForCode = useCallback(
    (code: string) => memoizedRates.find((rate) => rate.code === code),
    [memoizedRates]
  );

  // Use memoizedRates in the context value
  const memoizedValue = useMemo(
    () => ({ rates: memoizedRates, getRateForCode }),
    [memoizedRates, getRateForCode]
  );

  return (
    <RatesContext.Provider value={memoizedValue}>
      {children}
    </RatesContext.Provider>
  );
};

// Hook to access rates from the context
export const useRates = (currencyCode?: string): Rate[] | Rate | undefined => {
  const context = useContext(RatesContext);
  if (!context) {
    throw new Error('useRates must be used within a RatesProvider');
  }
  console.log('useRates ~ currencyCode:', currencyCode);

  if (currencyCode) {
    return context.getRateForCode(currencyCode);
  }

  return context.rates;
};
