'use client';

import {
  createContext,
  useState,
  useContext,
  useMemo,
  type ReactNode,
  useCallback,
} from 'react';

// Define a type for the state and another for the context which includes both the state and the functions to update it.
export type PixPaymentState = {
  name: string;
  pixKey: string;
  pixKeyParsed: string;
  amountBrl?: number;
  amountUsdt?: number;
  rateUsdtBrl?: number;
  loading: boolean;
  sending: boolean;
};

type PixPaymentContextType = {
  pixPaymentState: PixPaymentState;
  setPixPaymentState: React.Dispatch<React.SetStateAction<PixPaymentState>>;
  resetPixPaymentState: () => void;
};

// Create the context with a more descriptive and type-safe initial value.
export const PixPaymentContext = createContext<
  PixPaymentContextType | undefined
>(undefined);

/**
 * Provides a context provider for sending Pix data, including the current state and a function to update it.
 *
 * @param {ReactNode} children - The children components that will consume the context.
 */
export function PixPaymentProvider({ children }: { children: ReactNode }) {
  const initialState: PixPaymentState = useMemo(
    () => ({
      name: '',
      pixKey: '',
      pixKeyParsed: '',
      amountBrl: undefined,
      amountUsdt: undefined,
      rateUsdtBrl: undefined,
      loading: false, // Loading Pix Key data from API
      sending: false, // Sending payment info
    }),
    []
  );

  const [pixPaymentState, setPixPaymentState] =
    useState<PixPaymentState>(initialState);

  const resetPixPaymentState = useCallback(() => {
    setPixPaymentState(initialState);
  }, [initialState]);

  // Use useMemo to optimize performance and avoid unnecessary re-renders of the context consumers.
  const value = useMemo(
    () => ({ pixPaymentState, setPixPaymentState, resetPixPaymentState }),
    [pixPaymentState, resetPixPaymentState]
  );

  return (
    <PixPaymentContext.Provider value={value}>
      {children}
    </PixPaymentContext.Provider>
  );
}

/**
 * Custom hook to use the SendPix context.
 * It ensures that the hook is used within a SendPixProvider.
 *
 * @returns {PixPaymentContextType} The SendPix context value, including state and setState function.
 * @throws {Error} If the hook is used outside of a SendPixProvider.
 */
export function usePixPaymentContext(): PixPaymentContextType {
  const context = useContext(PixPaymentContext);
  if (context === undefined) {
    throw new Error(
      'usePixPaymentContext must be used within a SendPixProvider'
    );
  }
  return context;
}
