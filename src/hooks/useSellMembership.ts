"use client";

import { useAppContext } from "@/providers/app.provider";
import coffeeAbi from "@abi/CoffeeClubShares.json";
import { toastError } from "@components/CustomToast";
import { COFFEE_CONTRACT, currentChain } from "@constants/index";
import { getContractErrorMsg } from "@utils/getErrorMessage";
import { readContracts } from "@wagmi/core";
import { sendUserOperation } from "@zerodev/wagmi";
import { useCallback, useEffect, useState } from "react";
import { Address, encodeFunctionData, formatEther } from "viem";

const useSellMembership = (sharesSubject?: Address, refetchSharesBalance?: () => void) => {
  const { address } = useAppContext();

  const [isSelling, setIsSelling] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1);
  const [price, setPrice] = useState<any>(0);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);

  const [showTransaction, setShowTransaction] = useState<boolean>(false);
  const [loadingTx, setLoadingTx] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  useEffect(() => {
    if (!sharesSubject || !address) return;

    const getPrice = async () => {
      try {
        const result = await readContracts({
          contracts: [
            {
              abi: coffeeAbi as any,
              address: COFFEE_CONTRACT,
              chainId: currentChain.id,
              functionName: "getSellPriceAfterFee",
              args: [sharesSubject, amount],
            },
          ],
        });
        const newP = result?.[0]?.result as any;
        setPrice(newP);
      } catch (error) {
        console.log("err getSellPriceAfterFee", error);
      }
    };

    const timer = setTimeout(async () => {
      setLoadingPrice(true);
      await getPrice();
      setLoadingPrice(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [address, amount, sharesSubject, refetch]);

  const handleSellMembership = () => {
    if (!isSelling) {
      setIsSelling(true);
    } else {
      setShowConfirm(true);
    }
  };

  const increaseAmount = () => {
    setAmount((prev) => prev + 1);
  };
  const decreaseAmount = () => {
    setAmount((prev) => prev - 1);
  };

  const confirmSell = useCallback(async () => {
    setShowTransaction(true);
    setLoadingTx(true);

    try {
      // console.log("confirmSell", sharesSubject, amount);
      const result = await sendUserOperation({
        account: address,
        chainId: currentChain.id,
        to: COFFEE_CONTRACT,
        data: encodeFunctionData({
          abi: coffeeAbi,
          functionName: "sellShares",
          args: [sharesSubject, amount],
        }),
      });
      setTxHash(result?.hash);
      setLoadingTx(false);
      setIsSelling(false);
      refetchData();
      refetchSharesBalance?.();
      return true;
    } catch (error) {
      setLoadingTx(false);
      console.log("err sellShares", error);
      toastError(getContractErrorMsg(error));
      setShowTransaction(false);
      return false;
    }
  }, [address, amount, refetchSharesBalance, sharesSubject]);

  const refetchData = () => {
    setRefetch((prev) => !prev);
  };

  const handleDone = () => {
    setShowConfirm(false);
    setShowTransaction(false);
    setAmount(1);
  };

  return {
    handleSellMembership,
    confirmSell,
    isSelling,
    setIsSelling,
    showConfirm,
    setShowConfirm,
    showTransaction,
    loadingTx,
    txHash,
    amount,
    increaseAmount,
    decreaseAmount,
    price: formatEther(price || 0),
    loadingPrice,
    handleDone,
  };
};

export default useSellMembership;
