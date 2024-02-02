"use client";

import { get } from "@/request";
import { toastError, toastSuccess } from "@components/CustomToast";
import { TELEGRAM_BOT_URL } from "@constants/index";
import useDialog from "@hooks/useDialog";
import { useState } from "react";
import { useLoginContext } from "../provider";

export const useConfirmTele = () => {
  const { nextStep, address } = useLoginContext();
  const { handleClose, handleShow, show } = useDialog();

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [loadingCheck, setLoadingCheck] = useState<boolean>(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toastSuccess("Coppied wallet address!");
    setIsCopied(true);
  };

  const handelOpenTele = () => {
    window.open(`${TELEGRAM_BOT_URL}?start=${address}`);
    setIsOpened(true);
  };

  const handleCheckUserJoined = async () => {
    setLoadingCheck(true);
    try {
      const res = await get("/clubs/check-joined-my-club", {
        needAuth: true,
      });
      setLoadingCheck(false);
      if (!res?.data?.isJoined) {
        toastError(
          "It seems like you haven't joined your own Club yet. Make sure to tap on the invitation link to add yourself to your Club to continue.",
        );
        return;
      }
      toastSuccess("You have successfully joined The Coffee Club.");
      nextStep();
    } catch (error) {
      console.log("error joined", error);
      setLoadingCheck(false);
      toastError(
        "It seems like you haven't joined your own Club yet. Make sure to tap on the invitation link to add yourself to your Club to continue.",
      );
    }
  };

  return {
    show,
    isCopied,
    isOpened,
    loadingCheck,
    handleShow,
    handleClose,
    handleCopyAddress,
    handelOpenTele,
    handleCheckUserJoined,
  };
};
