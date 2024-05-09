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
  value: number;
}

interface RatesContextType {
  rates: Rate[];
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
  const { isAuthenticated } = useDynamicContext();
  const [rates, setRates] = useState(initialRates ?? []);

  const fetchRatesCb = useCallback(async () => {
    if (isAuthenticated) {
      const data = await fetchRates();
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

  // Use memoizedRates in the context value
  const memoizedValue = useMemo(
    () => ({ rates: memoizedRates }),
    [memoizedRates]
  );

  return (
    <RatesContext.Provider value={memoizedValue}>
      {children}
    </RatesContext.Provider>
  );
};

// Hook to access rates from the context
export const useRates = (): Rate[] | Rate | undefined => {
  const context = useContext(RatesContext);
  if (!context) {
    throw new Error('useRates must be used within a RatesProvider');
  }
  return context.rates;
};
