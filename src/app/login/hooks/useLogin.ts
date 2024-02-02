"use client";

import { useAppContext } from "@/providers/app.provider";
import { post } from "@/request";
import { toastError } from "@components/CustomToast";
import { URLS } from "@constants/index";
import useSharesBalance from "@hooks/useSharesBalance";
import { getSessionId, saveUserData } from "@utils/index";
import { ECDSAProvider } from "@zerodev/sdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import useLoginLoading from "./useLoginLoading";

const DEFAULT_MESSAGE = "Sign message with zerodev";

export const LOGIN_STEP = {
  SIGN_IN: 0,
  ALLOW_PERMISSIONS: 1,
  TRANSFER_ETH: 2,
  BUY_MEMBERSHIP: 3,
  REGISTER_TELEGRAM: 4,
  TELEGRAM_ISSUE: 5,
  CONFIRM_JOIN: 6,
  REFERRAL: 7,
} as const;

const useLogin = () => {
  const { push } = useRouter();
  const chainId = useChainId();
  const { userInfo, setUserInfo } = useAppContext();
  const { connector, address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { getLoginSharesBalance } = useSharesBalance();
  const { startLoading, removeLoading } = useLoginLoading();
  const { disconnectAsync } = useDisconnect();

  const [currStep, setCurrStep] = useState<number>();
  const [referralCode, setReferralCode] = useState<string>("");
  const [hasRegistered, setHasRegistered] = useState(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  useEffect(() => {
    if (!connector || hasLoggedIn) return;

    const handleLoginError = async (error: any) => {
      if (error?.message === "401 - User does not exist!") {
        try {
          const info = await (connector as any)?.web3Auth?.getUserInfo();
          console.log("User does not exist, zerodev", info);
          setUserInfo(info);
        } catch (error) {
          console.log("User does not exist error", error);
          removeLoading();
        }
      } else {
        toastError(error?.message);
        console.log("login error", error);
        removeLoading();
      }
    };

    const fetchUserInfo = async () => {
      try {
        startLoading();
        console.log("startLoading fetchUserInfo", true);
        sessionStorage.setItem("loading", "true");
        const provider: ECDSAProvider = await connector?.getProvider();
        const signature = await provider?.signMessageWith6492(DEFAULT_MESSAGE);
        const account = await connector?.getAccount();

        const res = await post("/login", {
          body: {
            walletAddress: account,
            message: DEFAULT_MESSAGE,
            signature,
          },
        });

        const { token, user } = res.data;
        saveUserData(account, token?.token, user);
        setReferralCode(user?.referral_code || "");
        setUserInfo(user);
        setHasLoggedIn(true);
      } catch (error) {
        handleLoginError(error);
      }
    };

    fetchUserInfo();
  }, [connector, hasLoggedIn, removeLoading, setUserInfo, startLoading]);

  useEffect(() => {
    if (!connector || hasRegistered) return;

    const getCurrentStep = async () => {
      if (!address || !hasLoggedIn) return;
      const balance = await getLoginSharesBalance(address);
      if (!balance || balance === 0) {
        return LOGIN_STEP.ALLOW_PERMISSIONS;
      }
      if (!userInfo?.telegram) {
        return LOGIN_STEP.REGISTER_TELEGRAM;
      }
      const isJoined = userInfo?.group?.is_joined_your_group;
      const isRequested = userInfo?.group?.is_requested_your_group;
      if (isJoined) {
        push(URLS.EXPLORE);
        return;
      }
      if (!isRequested) {
        return LOGIN_STEP.TELEGRAM_ISSUE;
      }
      if (!isJoined) {
        return LOGIN_STEP.CONFIRM_JOIN;
      }
    };

    (async () => {
      const handleRegister = async () => {
        if (!userInfo) return;
        try {
          const provider: ECDSAProvider = await connector?.getProvider();
          const signature = await provider?.signMessageWith6492(DEFAULT_MESSAGE);
          const { name, profileImage, verifierId } = userInfo;
          const REGEX_TWITTER_ID = /\|(\d+)/gm;
          const match = REGEX_TWITTER_ID.exec(verifierId);
          const res = await post("/register", {
            body: {
              walletAddress: address,
              userInfo: {
                name,
                twitterId: match?.[1],
                avatar: profileImage,
              },
              message: DEFAULT_MESSAGE,
              signature,
            },
          });

          const { token, user } = res.data;
          saveUserData(address, token?.token, user);
          setReferralCode(user?.referral_code || "");
          setUserInfo(user);
          setHasRegistered(true);
        } catch (error) {
          console.log("error register", error);
          if (error?.message === "500 - Internal Server Error") {
            await disconnectAsync();
            setCurrStep(LOGIN_STEP.SIGN_IN);
            removeLoading();
            window.location.reload();
            return;
          }
          toastError(error?.message);
          removeLoading();
          connector?.disconnect();
          setCurrStep(LOGIN_STEP.SIGN_IN);
        }
      };

      if (!userInfo?.referral_code && !!userInfo?.verifierId) {
        handleRegister();
        return;
      }

      const step = await getCurrentStep();
      console.log("getCurrentStep", step);
      if (!!step) removeLoading();

      setCurrStep(step);
    })();
  }, [
    connector,
    address,
    userInfo,
    hasLoggedIn,
    hasRegistered,
    getLoginSharesBalance,
    push,
    setUserInfo,
    removeLoading,
    disconnectAsync,
  ]);

  const firstLoading = useMemo(() => {
    if (typeof window === "undefined") return;
    const sessionId = getSessionId();
    const wagmiStoreConnected = localStorage.getItem("wagmi.connected") === "true";
    const connected = !!sessionId && wagmiStoreConnected;
    return connected;
  }, []);

  // This effect prevents the loading state from persisting indefinitely if the connector fails to auto-reconnect.
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (firstLoading) {
      // Start loading when firstLoading is true
      startLoading();
      console.log("firstLoading timeout 5s");

      // Set a timeout to remove loading after 5 seconds
      timeoutId = setTimeout(() => {
        removeLoading();
        console.log("removeLoading timeout 5s");
      }, 5_000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [firstLoading, startLoading, removeLoading]);

  const nextStep = useCallback(() => {
    setCurrStep((curr) => curr + 1);
  }, []);

  const resetStep = useCallback(() => {
    setCurrStep(LOGIN_STEP.SIGN_IN);
  }, []);

  const signIn = useCallback(async () => {
    try {
      startLoading();
      console.log("signIn useCallback", true);
      await connectAsync({
        chainId,
        connector: connectors[0],
      });
    } catch (error) {
      console.log("err signIn ", error);
      toastError(error?.message);
      removeLoading();
      // window.location.reload();
    }
  }, [chainId, connectAsync, connectors, removeLoading, startLoading]);

  useEffect(() => {
    const shouldReload = localStorage.getItem("shouldReload");
    if (shouldReload === "true") {
      localStorage.removeItem("shouldReload");
      removeLoading();
      window.location.reload();
    }
  }, [removeLoading]);

  const loading =
    typeof window !== "undefined" ? sessionStorage.getItem("loading") === "true" : false;

  return {
    address,
    userInfo,
    currStep,
    nextStep,
    resetStep,
    loading,
    isConnected,
    referralCode,
    signIn,
  };
};

export default useLogin;
