"use client";

import coffeeAbi from "@abi/CoffeeClubShares.json";
import { COFFEE_CONTRACT, currentChain } from "@constants/index";
import { useEffect, useState } from "react";
import { Address, readContracts } from "wagmi";
import useDialog from "./useDialog";
import useFetch from "./useFetch";

const useOwned = (clubId?: string | number, clubOwnerAddress?: Address) => {
  const { show, handleClose, handleShow } = useDialog();
  const [ownedList, setOwnedList] = useState<any[]>([]);
  const [ownedAmount, setOwnedAmount] = useState<string>("0");
  const [loadingAmount, setLoadingAmount] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);

  const { data: dataOwned, loading: loadingData } = useFetch(`/clubs/${clubId}/holders`, !!clubId);

  useEffect(() => {
    if (!dataOwned) return;
    setOwnedList(dataOwned?.data || []);
    setRefetch((prev) => !prev);
  }, [dataOwned]);

  useEffect(() => {
    if (!clubOwnerAddress) return;
    (async () => {
      setLoadingAmount(true);
      try {
        const result = await readContracts({
          contracts: [
            {
              chainId: currentChain.id,
              abi: coffeeAbi as any,
              address: COFFEE_CONTRACT,
              functionName: "sharesSupply",
              args: [clubOwnerAddress],
            },
          ],
        });
        const newB = result[0]?.result as any;
        setOwnedAmount(BigInt(newB).toString());
        setLoadingAmount(false);
      } catch (error) {
        console.log("err sharesSupply", error);
        setLoadingAmount(false);
      }
    })();
  }, [clubOwnerAddress, refetch]);

  return {
    show,
    handleShow,
    handleClose,
    loadingData,
    ownedList,
    loadingAmount,
    ownedAmount,
  };
};

export default useOwned;
