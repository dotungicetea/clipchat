"use client";

import { useAppContext } from "@/providers/app.provider";
import coffeeAbi from "@abi/CoffeeClubShares.json";
import { COFFEE_CONTRACT, currentChain } from "@constants/index";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";
import { readContracts } from "wagmi";

const useSharesBalance = (sharesSubject?: Address) => {
  const { address } = useAppContext();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    if (!address || !sharesSubject) return;
    (async () => {
      setLoading(true);
      try {
        const result = await readContracts({
          contracts: [
            {
              abi: coffeeAbi as any,
              address: COFFEE_CONTRACT,
              chainId: currentChain.id,
              functionName: "sharesBalance",
              args: [sharesSubject, address],
            },
          ],
        });
        const newB = result[0]?.result as any;
        console.log("shareBalance", BigNumber(newB).toNumber());
        setBalance(BigNumber(newB).toNumber());
      } catch (error) {
        console.log("err getSharesBalance", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [address, refetch, sharesSubject]);

  const getLoginSharesBalance = useCallback(async (address?: Address) => {
    if (!address) return;
    try {
      const result = await readContracts({
        contracts: [
          {
            abi: coffeeAbi as any,
            address: COFFEE_CONTRACT,
            chainId: currentChain.id,
            functionName: "sharesBalance",
            args: [address, address],
          },
        ],
      });
      const newB = result[0]?.result as any;
      return BigNumber(newB).toNumber();
    } catch (error) {
      console.log("err getSharesBalance", error);
      return 0;
    }
  }, []);

  const refetchSharesBalance = () => {
    setRefetch((prev) => !prev);
  };

  return {
    balance,
    loading,
    refetchSharesBalance,
    getLoginSharesBalance,
  };
};

export default useSharesBalance;
