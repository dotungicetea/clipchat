"use client";

import iconWallet from "@images/icon-wallet.svg";
import clsx from "clsx";
import Image from "next/image";
import { useBridgeContext } from "../provider";

const ConnectWallet = () => {
  const { connect, loadingConnect } = useBridgeContext();

  return (
    <>
      <div className="relative mx-auto mt-[15vh]">
        <Image alt="" src={iconWallet} className="h-10 w-auto" />
      </div>
      <p className={clsx("labelText mt-[15px]")}>Connect Wallet</p>
      <p className={clsx("normalText mt-[5vh]")}>
        Connect your wallet to deposit at least <span className="text-yellow">0.001</span> ETH in
        your Coffee Club wallet.
      </p>
      <div className="fixed bottom-0 left-1/2 min-h-[140px] w-full max-w-md -translate-x-1/2 bg-black px-[15px] pb-5 pt-[15px]">
        <button
          className={clsx("btn btnGray mt-10")}
          onClick={() => connect?.()}
          disabled={loadingConnect}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default ConnectWallet;
