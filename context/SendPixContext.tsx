'use client';

import {
  createContext,
  useState,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

// Define a type for the state and another for the context which includes both the state and the functions to update it.
type SendPixState = {
  amount: string;
  name: string;
  pixKey: string;
  reformatedPixKey: string;
  sending: boolean;
};

type SendPixContextType = {
  sendPixState: SendPixState;
  setSendPixState: React.Dispatch<React.SetStateAction<SendPixState>>;
};

// Create the context with a more descriptive and type-safe initial value.
export const SendPixContext = createContext<SendPixContextType | undefined>(
  undefined
);

/**
 * Provides a context provider for sending Pix data, including the current state and a function to update it.
 *
 * @param {ReactNode} children - The children components that will consume the context.
 */
export function SendPixProvider({ children }: { children: ReactNode }) {
  const initialState: SendPixState = {
    amount: '',
    name: '',
    pixKey: '',
    reformatedPixKey: '',
    sending: false,
  };

  const [sendPixState, setSendPixState] = useState<SendPixState>(initialState);

  // Use useMemo to optimize performance and avoid unnecessary re-renders of the context consumers.
  const value = useMemo(
    () => ({ sendPixState, setSendPixState }),
    [sendPixState]
  );

  return (
    <SendPixContext.Provider value={value}>{children}</SendPixContext.Provider>
  );
}

/**
 * Custom hook to use the SendPix context.
 * It ensures that the hook is used within a SendPixProvider.
 *
 * @returns {SendPixContextType} The SendPix context value, including state and setState function.
 * @throws {Error} If the hook is used outside of a SendPixProvider.
 */
export function useSendPixContext(): SendPixContextType {
  const context = useContext(SendPixContext);
  if (context === undefined) {
    throw new Error('useSendPixContext must be used within a SendPixProvider');
  }
  return context;
}
