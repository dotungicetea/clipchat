"use client";

import { useAppContext } from "@/providers/app.provider";
import coffeeAbi from "@abi/CoffeeClubShares.json";
import { toastError } from "@components/CustomToast";
import { COFFEE_CONTRACT, currentChain } from "@constants/index";
import { getContractErrorMsg } from "@utils/getErrorMessage";
import { readContracts } from "@wagmi/core";
import { sendUserOperation } from "@zerodev/wagmi";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { Address, encodeFunctionData, formatEther } from "viem";

const useBuyMembership = (sharesSubject?: Address, refetchSharesBalance?: () => void) => {
  const { address, userBalance } = useAppContext();

  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [isBought, setIsBought] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1);
  const [price, setPrice] = useState<any>(0);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showFeeInfo, setShowFeeInfo] = useState<boolean>(false);
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
              functionName: "getBuyPriceAfterFee",
              args: [sharesSubject, amount],
            },
          ],
        });
        const newP = result?.[0]?.result as any;
        setPrice(newP);
      } catch (error) {
        console.log("err getBuyPriceAfterFee", error);
      }
    };

    const timer = setTimeout(async () => {
      setLoadingPrice(true);
      await getPrice();
      setLoadingPrice(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [address, amount, sharesSubject, refetch]);

  const handleBuyMembership = () => {
    if (!isBuying) {
      setIsBuying(true);
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
  const toggleFeeInfo = () => {
    setShowFeeInfo((prev) => !prev);
  };

  const confirmBuy = useCallback(async () => {
    if (!sharesSubject || !address) return;
    if (BigNumber(formatEther(price)).gte(userBalance?.formatted)) {
      toastError("Insufficient balance!");
      return;
    }
    setShowTransaction(true);
    setLoadingTx(true);

    try {
      // console.log("confirmBuy", sharesSubject, amount, price);
      const result = await sendUserOperation({
        account: address,
        to: COFFEE_CONTRACT,
        chainId: currentChain.id,
        data: encodeFunctionData({
          abi: coffeeAbi,
          functionName: "buyShares",
          args: [sharesSubject, amount],
        }),
        value: price,
      });
      setTxHash(result?.hash);
      setLoadingTx(false);
      setIsBuying(false);
      setIsBought(true);
      refetchData();
      refetchSharesBalance?.();
      return true;
    } catch (error) {
      setLoadingTx(false);
      setIsBought(false);
      console.log("err buyShares", error);
      toastError(getContractErrorMsg(error));
      setShowTransaction(false);
      return false;
    }
  }, [address, amount, price, refetchSharesBalance, sharesSubject, userBalance?.formatted]);

  const refetchData = () => {
    setRefetch((prev) => !prev);
  };

  const handleDone = () => {
    setShowConfirm(false);
    setShowTransaction(false);
    setAmount(1);
  };

  const handleCloseCoating = useCallback(() => {
    setShowConfirm(false);
    if (loadingTx) return;
    setShowConfirm(false);
    setShowTransaction(false);
    setAmount(1);
  }, [loadingTx]);

  return {
    handleBuyMembership,
    confirmBuy,
    isBuying,
    setIsBuying,
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
    showFeeInfo,
    toggleFeeInfo,
    handleDone,
    handleCloseCoating,
    isBought,
    setIsBought,
  };
};

export default useBuyMembership;
