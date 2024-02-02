"use client";

import { get } from "@/request";
import coffeeAbi from "@abi/CoffeeClubShares.json";
import { toastError, toastSuccess } from "@components/CustomToast";
import { COFFEE_CONTRACT, URLS, currentChain } from "@constants/index";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { Address } from "wagmi";

export const useReferral = (address: Address) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { push } = useRouter();

  const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
    setReferralCode(e.target.value);
  };

  const handleSkip = useCallback(() => {
    push(URLS.EXPLORE);
  }, [push]);

  const handleSubmit = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await get(`/wallet-by-referral-code/${referralCode}`, {
        needAuth: true,
      });
      const walletRefCode = res?.data?.walletAddress;

      const config: any = await prepareWriteContract({
        address: COFFEE_CONTRACT,
        abi: coffeeAbi,
        chainId: currentChain.id,
        functionName: "setReferrer",
        account: address,
        args: [walletRefCode],
      });
      const { hash } = await writeContract(config);
      setLoading(false);
      console.log("submit referral code hash", hash);
      if (!hash) return;
      toastSuccess("Used referral code successfully!");
      handleSkip();
    } catch (error) {
      setLoading(false);
      console.log("err wallet-by-referral-code", error);
      toastError(error?.message);
    }
  }, [address, handleSkip, referralCode]);

  return {
    loading,
    referralCode,
    handleChangeCode,
    skip: handleSkip,
    handleSubmit,
  };
};
