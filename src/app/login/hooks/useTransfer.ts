"use client";

import { useAppContext } from "@/providers/app.provider";
import { toastError, toastSuccess } from "@components/CustomToast";
import useDialog from "@hooks/useDialog";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useLoginContext } from "../provider";

export const useTransfer = () => {
  const { handleClose, handleShow, show } = useDialog();
  const { nextStep, address } = useLoginContext();
  const { userBalance } = useAppContext();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toastSuccess("Coppied wallet address!");
  };
  const handleNextStep = useCallback(() => {
    if (BigNumber(userBalance?.formatted).lt(0.001)) {
      toastError(
        "You must deposit at least 0.001 ETH to your Account Abstraction wallet address on Base network in order to continue.",
      );
      return;
    }
    nextStep?.();
  }, [nextStep, userBalance?.formatted]);

  return {
    address,
    show,
    handleShow,
    handleClose,
    handleCopyAddress,
    handleNextStep,
  };
};
