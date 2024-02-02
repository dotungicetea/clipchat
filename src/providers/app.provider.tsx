"use client";

import Loading from "@components/PageLoading";
import { NETWORK_ID, URLS } from "@constants/index";
import useDialog from "@hooks/useDialog";
import useFetch from "@hooks/useFetch";
import { getUserData } from "@utils/index";
import { FetchBalanceResult } from "@wagmi/core";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Address, Chain, useAccount, useBalance, useNetwork } from "wagmi";

const ConfirmSignOut = dynamic(() => import("@components/ConfirmSignOut"), { ssr: false });

export type AppContextProps = {
  refetch?: boolean;
  address: Address;
  userBalance?: FetchBalanceResult;
  myClub?: any;
  userInfo?: any;
  setUserInfo: Dispatch<any>;
  loadingBalance?: boolean;
  refetchBalance?: any;
  signOut: () => void;
  chain: Chain | undefined;
  refetchMyClub: () => void;
};
type AppProviderProps = {};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export default function AppProvider({ children }: PropsWithChildren<AppProviderProps>) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [userInfo, setUserInfo] = useState(getUserData()?.user);
  const { show, handleClose, handleShow } = useDialog();
  const pathname = usePathname();
  const [isPending] = useTransition();

  const {
    data: userBalance,
    isLoading: loadingBalance,
    refetch: refetchBalance,
  } = useBalance({
    address: address || userInfo?.wallet_address,
    enabled: !!address,
    chainId: NETWORK_ID,
  });

  const shouldFetch = useMemo(() => {
    const hiddenRoutes = ["/", URLS.LOGIN, URLS.BRIDGE];
    return !hiddenRoutes.includes(pathname);
  }, [pathname]);

  const { data: myClub, mutate: refetchMyClub } = useFetch("/clubs/my-club", shouldFetch);

  useEffect(() => {
    const timer = setInterval(() => refetchBalance(), 5_000);
    return () => clearInterval(timer);
  }, [refetchBalance]);

  return (
    <AppContext.Provider
      value={{
        chain,
        address: address || userInfo?.wallet_address,
        userInfo,
        setUserInfo,
        userBalance,
        loadingBalance,
        refetchBalance,
        myClub,
        signOut: handleShow,
        refetchMyClub,
      }}
    >
      {children}
      <Loading show={isPending} />
      <ConfirmSignOut show={show} handleClose={handleClose} />
    </AppContext.Provider>
  );
}
export function useAppContext() {
  return useContext(AppContext);
}
