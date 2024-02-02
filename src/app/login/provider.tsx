"use client";

import useDialog from "@hooks/useDialog";
import dynamic from "next/dynamic";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { isMobileSafari, isSafari } from "react-device-detect";
import { Address } from "viem";
import useLogin from "./hooks/useLogin";

const LandingPage = dynamic(() => import("./components/LandingPage"), { ssr: false });
const ConfirmSignOut = dynamic(() => import("@components/ConfirmSignOut"), { ssr: false });
const LoginHeader = dynamic(() => import("./components/login.header"), { ssr: false });

interface LoginContextProps {
  address: Address;
  userInfo: any;
  currStep: number;
  nextStep: () => void;
  isIOSDevice: boolean;
  referralCode?: string;
  handleShowSignOutDialog?: () => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

interface LoginProviderProps {}

export default function LoginProvider({ children }: PropsWithChildren<LoginProviderProps>) {
  const { address, userInfo, currStep, nextStep, referralCode, resetStep } = useLogin();
  const { show, handleClose, handleShow: handleShowSignOutDialog } = useDialog();

  const [isPWA, setIsPWA] = useState<boolean>(false);
  const isIOSDevice = isSafari || isMobileSafari;

  useEffect(() => {
    const isRunningAsPWA =
      (window.navigator as any)?.standalone ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsPWA(isRunningAsPWA);
  }, []);

  return (
    <LoginContext.Provider
      value={{
        address,
        userInfo,
        currStep,
        nextStep,
        isIOSDevice,
        referralCode,
        handleShowSignOutDialog,
      }}
    >
      {isPWA ? (
        <div className="login-container flex flex-col justify-center px-[15px] text-center">
          <LoginHeader show={!!currStep && currStep > 1} />
          {children}
        </div>
      ) : (
        <LandingPage isIOSDevice={isIOSDevice} />
      )}

      <ConfirmSignOut
        show={show}
        handleClose={handleClose}
        resetStep={resetStep}
        message="Are you sure you want to sign out? You will lose all progress during this sign up and will need start over"
      />
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  return useContext(LoginContext);
}
