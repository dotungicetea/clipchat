"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Address } from "viem";
import useEthers from "./hooks/useEthers";

export const BRIDGE_STEPS = {
  ENTER_CODE: 1,
  BRIDGE: 2,
} as const;

interface BridgeContext {
  currStep: number;
  nextStep: () => void;
  connect: () => Promise<void>;
  isConnected: boolean;
  coffeeAddress: Address;
  setCoffeeAddress: Dispatch<SetStateAction<Address>>;
  account: Address;
  disconnect: () => void;
  loadingConnect: boolean;
  chainId: number;
  chainName: string;
  ethBalance?: string;
  isWrongChain: boolean;
}

const BridgeContext = createContext<BridgeContext | undefined>(undefined);

export default function BridgeProvider({ children }) {
  const {
    connect,
    isConnected,
    account,
    disconnect,
    loadingConnect,
    ethBalance,
    chainId,
    chainName,
    isWrongChain,
  } = useEthers();
  const [currStep, setCurrStep] = useState<number>(BRIDGE_STEPS.ENTER_CODE);
  const [coffeeAddress, setCoffeeAddress] = useState<Address | null>(null);

  const nextStep = () => {
    setCurrStep((curr) => curr + 1);
  };
  return (
    <BridgeContext.Provider
      value={{
        currStep,
        nextStep,
        coffeeAddress,
        setCoffeeAddress,
        connect,
        isConnected,
        account,
        disconnect,
        loadingConnect,
        chainId,
        chainName,
        ethBalance,
        isWrongChain,
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
}

export function useBridgeContext() {
  return useContext(BridgeContext);
}
