"use client";

import { toastError } from "@components/CustomToast";
import { L1_NETWORK_ID, NETWORK_ID, currentChain } from "@constants/index";
import * as OP from "@eth-optimism/sdk";
import { ethers } from "ethers";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { isAddress, parseEther } from "viem";
import { useBridgeContext } from "../provider";

enum TxStatus {
  Pending,
  Confirmed,
}
const DEFAULT_WIDTH_INPUT = "16px";
export const useBridge = () => {
  const { account: address, coffeeAddress, ethBalance, isWrongChain } = useBridgeContext();

  const [inputAmount, setInputAmount] = useState<string>("");
  const [inputWidth, setInputWidth] = useState<string>(DEFAULT_WIDTH_INPUT);
  const [showConnectMessage, setShowConnectMessage] = useState<boolean>(false);
  const [loadingL1, setLoadingL1] = useState<boolean>(false);
  const [loadingL2, setLoadingL2] = useState<boolean>(false);
  const [l1TxHash, setL1TxHash] = useState<string>("");
  const [l1TxStatus, setL1TxStatus] = useState<TxStatus | null>(null);
  const [l2TxHash, setL2TxHash] = useState<string>("");
  const [l2TxStatus, setL2TxStatus] = useState<TxStatus | null>(null);
  const [l2StartBlockNumber, setL2StartBlockNumber] = useState<number | null>(null);
  const [messageStatus, setMessageStatus] = useState<OP.MessageStatus | null>(null);
  const [bridgeInProgress, setBridgeInProgress] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);

  const messenger = useMemo(() => {
    if (!address || isWrongChain) return;

    try {
      const l1Provider = new ethers.providers.Web3Provider(window.ethereum).getSigner(address);
      const l2Provider = new ethers.providers.JsonRpcProvider(
        currentChain.rpcUrls.default.http[0],
      ).getSigner(address);
      return new OP.CrossChainMessenger({
        l1ChainId: L1_NETWORK_ID,
        l2ChainId: NETWORK_ID,
        l1SignerOrProvider: l1Provider,
        // l1SignerOrProvider: signer as any,
        l2SignerOrProvider: l2Provider,
      });
    } catch (error) {
      console.log("err provider", error?.message);
    }
  }, [address, isWrongChain]);

  const bridge = useCallback(async () => {
    if (isWrongChain) {
      toastError("Wrong chain");
      return;
    }
    if (!coffeeAddress || !isAddress(coffeeAddress)) {
      toastError("Invalid Address");
      return;
    }
    if (isNaN(+inputAmount)) {
      toastError("Invalid amount!");
      return;
    }
    if (!inputAmount || +inputAmount === 0) {
      toastError("Amount must be greater than 0!");
      return;
    }
    try {
      setBridgeInProgress(true);
      setLoadingL1(true);
      // bridging
      const response = await messenger.depositETH(parseEther(inputAmount).toString(), {
        recipient: coffeeAddress,
      });
      setLoadingL2(true);
      setLoadingL1(false);
      console.log("bridging", inputAmount, response);
      setL1TxHash(response.hash);
      setL1TxStatus(TxStatus.Pending);
      await response.wait();
      setL1TxStatus(TxStatus.Confirmed);

      // we will use the L2 block number to optimize
      // our L2 calls looking for the bridge transaction
      const l2Block = await messenger.l2Provider.getBlockNumber();
      const waitTime = await messenger.estimateMessageWaitTimeSeconds(
        response.hash,
        0, // message index, 0 unless multicall
        l2Block,
      );
      setEstimatedWaitTime(waitTime);
      setL2StartBlockNumber(l2Block);
      const l2Receipt = await messenger.waitForMessageReceipt(response.hash, {
        fromBlockOrBlockHash: l2Block,
      });
      setL2TxStatus(TxStatus.Confirmed);
      setL2TxHash(l2Receipt.transactionReceipt.transactionHash);
      setLoadingL2(false);
      setBridgeInProgress(false);
    } catch (e) {
      setBridgeInProgress(false);
      console.log("err bridge", e);
      toastError(e?.message || "Fail to Bridge");
      setLoadingL1(false);
      setLoadingL2(false);
    }
  }, [inputAmount, coffeeAddress, isWrongChain, messenger]);

  // effect to poll for message status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const getMessageStatusAsync = async () => {
      if (!bridgeInProgress) return;
      try {
        const status = await messenger.getMessageStatus(
          l1TxHash,
          0, // message index, 0 unless multicall
          l2StartBlockNumber,
        );
        setMessageStatus(status);
      } catch (e) {
        console.error(e);
      }
    };

    if (l2StartBlockNumber && bridgeInProgress) {
      // Call immediately.
      getMessageStatusAsync();
      // Then every second.
      intervalId = setInterval(getMessageStatusAsync, 1000);
    } else {
      // Clear interval if bridge operation is not in progress.
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [l2StartBlockNumber, messenger, bridgeInProgress, l1TxHash]);

  // effect for timer
  useEffect(() => {
    let timerIntervalId: NodeJS.Timeout;

    if (
      bridgeInProgress &&
      l1TxStatus === TxStatus.Confirmed &&
      l2TxStatus !== TxStatus.Confirmed
    ) {
      timerIntervalId = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    } else {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    }

    return () => {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    };
  }, [l1TxStatus, l2TxStatus, bridgeInProgress]);

  // solving an annoying hydration diff issue
  useEffect(() => {
    if (address) {
      setShowConnectMessage(false);
    } else {
      setShowConnectMessage(true);
    }
  }, [address]);

  useEffect(() => {
    const strLength = inputAmount.length;
    if (!inputAmount || strLength === 0) {
      setInputWidth(DEFAULT_WIDTH_INPUT);
      return;
    }
    const widthByLength = (strLength + 2) * 8;
    const maxWitdh = 200;
    const newWidth = widthByLength > maxWitdh ? maxWitdh : widthByLength;
    setInputWidth(newWidth + "px");
  }, [inputAmount]);

  const handleSelectMax = () => {
    setInputAmount(ethBalance);
  };
  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    const lastChar = str.at(-1);
    const prevStr = str.slice(0, -1);

    if (prevStr.includes(".") && [".", ","].includes(lastChar)) return;

    setInputAmount(lastChar === "," ? prevStr + "." : str);
  };
  const handleCancel = () => {
    setInputAmount("");
  };
  const handleDone = () => {
    window.close();
  };

  return {
    bridge,
    l1TxHash,
    l1TxStatus,
    messageStatus,
    l2TxHash,
    l2TxStatus,
    elapsedTime,
    estimatedWaitTime,
    showConnectMessage,
    inputAmount,
    inputWidth,
    handleChangeAmount,
    handleSelectMax,
    handleCancel,
    loadingL1,
    loadingL2,
    handleDone,
  };
};

export function humanMessageStatus(status: OP.MessageStatus) {
  switch (status) {
    case OP.MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE:
      return "UNCONFIRMED_L1_TO_L2_MESSAGE";
    case OP.MessageStatus.FAILED_L1_TO_L2_MESSAGE:
      return "FAILED_L1_TO_L2_MESSAGE";
    case OP.MessageStatus.STATE_ROOT_NOT_PUBLISHED:
      return "STATE_ROOT_NOT_PUBLISHED";
    case OP.MessageStatus.READY_TO_PROVE:
      return "READY_TO_PROVE";
    case OP.MessageStatus.IN_CHALLENGE_PERIOD:
      return "IN_CHALLENGE_PERIOD";
    case OP.MessageStatus.READY_FOR_RELAY:
      return "READY_FOR_RELAY";
    case OP.MessageStatus.RELAYED:
      return "RELAYED";
    default:
      return "UNKNOWN";
  }
}
