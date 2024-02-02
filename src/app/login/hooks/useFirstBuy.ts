"use client";

import coffeeAbi from "@abi/CoffeeClubShares.json";
import { toastError } from "@components/CustomToast";
import { COFFEE_CONTRACT, currentChain } from "@constants/index";
import { getContractErrorMsg } from "@utils/getErrorMessage";
import { sendUserOperation } from "@zerodev/wagmi";
import { useCallback, useState } from "react";
import { Address, encodeFunctionData } from "viem";

export const useFirstBuy = (address: Address | undefined) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showTransaction, setshowTransaction] = useState<boolean>(false);
  const [loadingTx, setLoadingTx] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const confirmBuy = useCallback(async () => {
    if (!address) return;

    setshowTransaction(true);
    setLoadingTx(true);

    try {
      console.log("confirm first Buy");
      const result = await sendUserOperation({
        account: address,
        to: COFFEE_CONTRACT,
        chainId: currentChain.id,
        data: encodeFunctionData({
          abi: coffeeAbi,
          functionName: "buyShares",
          args: [address, 1],
        }),
        value: BigInt(0),
      });
      setTxHash(result?.hash);
      setLoadingTx(false);
      return true;
    } catch (error) {
      setLoadingTx(false);
      console.log("err buyShares", error);
      toastError(getContractErrorMsg(error));
      // back to confirm step
      setshowTransaction(false);
      return false;
    }
  }, [address]);

  return {
    confirmBuy,
    showConfirm,
    setShowConfirm,
    showTransaction,
    loadingTx,
    txHash,
  };
};
