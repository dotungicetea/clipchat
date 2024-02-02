"use client";

import iconWallet from "@images/icon-wallet.svg";
import { formatCurrency } from "@utils/index";
import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState } from "react";
import { humanMessageStatus, useBridge } from "../hooks/useBridge";
import { useBridgeContext } from "../provider";
import ConnectWallet from "./connect.wallet";
import TxInfo from "./tx.info";

const Bridge = () => {
  const { isConnected, coffeeAddress, account, ethBalance } = useBridgeContext();

  const {
    bridge,
    loadingL1,
    l1TxHash,
    l1TxStatus,
    messageStatus,
    loadingL2,
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
    handleDone,
  } = useBridge();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isLoading = useMemo(() => loadingL1 || loadingL2, [loadingL1, loadingL2]);

  if (!isConnected) {
    return <ConnectWallet />;
  }

  if (showConnectMessage) {
    return <p className="normalText mt-4">Connect to a wallet to get started</p>;
  }

  return (
    <>
      <div className="no-scrollbar flex h-[calc(100vh-140px)] flex-col items-center pb-5 pt-[15vh] text-center">
        <div className="relative mx-auto">
          <Image alt="" src={iconWallet} className="h-10 w-auto" />
        </div>
        <p className={clsx("labelText mt-[15px]")}>Deposit on ETH mainnet</p>

        <span className="textBlur labelText mt-[5vh]">From Connected Wallet</span>
        <p className="normalText">{account}</p>
        <div className="labelText flex items-center">
          <span className="textBlur">Available Balance</span>
          <span className="ml-2.5">{`${formatCurrency(ethBalance || 0)} ETH`}</span>
        </div>
        <span className="textBlur labelText mt-[2.5vh]">To Your Coffee Club Wallet</span>
        <p className="normalText">{coffeeAddress}</p>

        <div className="btnGray mt-2.5 flex w-full px-2.5 py-1.5">
          <div
            className={clsx(
              "group flex w-full items-center justify-center font-bold",
              isFocused ? "text-white" : "textBlur",
            )}
          >
            <input
              type="tel"
              inputMode="decimal"
              className="w-fit bg-transparent text-center outline-none"
              autoFocus
              value={inputAmount}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleChangeAmount}
              style={{ width: inputWidth }}
              disabled={isLoading}
            />
            <span className={isLoading ? "opacity-50" : ""}>ETH</span>
          </div>
          <button
            className="titleText ml-2.5 w-fit cursor-pointer text-purple"
            onClick={handleSelectMax}
            disabled={isLoading}
          >
            MAX
          </button>
        </div>

        <div className="labelText mt-5 flex flex-col items-center !normal-case">
          {l1TxHash ? <TxInfo isL1={true} txHash={l1TxHash} txStatus={l1TxStatus} /> : null}

          {estimatedWaitTime > 0 && (
            <>
              <p>Waiting for L2. Estimated wait time: {estimatedWaitTime} seconds</p>
              <p>Elapsed time: {elapsedTime} seconds</p>
            </>
          )}
          {messageStatus != null && <p> L2 message status: {humanMessageStatus(messageStatus)} </p>}
          {l2TxHash ? <TxInfo isL1={false} txHash={l2TxHash} txStatus={l2TxStatus} /> : null}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 min-h-[140px] w-full max-w-md -translate-x-1/2 bg-black bg-transparent px-[15px] pb-5 pt-[15px]">
        {!!l2TxHash ? (
          <button className="btn btnGray mt-10" onClick={() => handleDone?.()}>
            Done! Close this tab
          </button>
        ) : (
          <>
            <button className="btn btnGray" onClick={bridge} disabled={isLoading}>
              {isLoading ? "Depositing..." : "Deposit ETH"}
            </button>
            <button
              className="btn btnBorder mt-1.5"
              onClick={handleCancel}
              disabled={!inputAmount || isLoading}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Bridge;
