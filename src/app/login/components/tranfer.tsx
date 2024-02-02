"use client";

import { useAppContext } from "@/providers/app.provider";
import iconCopy from "@images/icon-copy.svg";
import iconEthereum from "@images/icon-ethereum.svg";
import iconRefresh from "@images/icon-refresh.svg";
import { formatCurrency } from "@utils/index";
import clsx from "clsx";
import Image from "next/image";
import { useTransfer } from "../hooks/useTransfer";
import styles from "../login.module.scss";
import BridgeDialog from "./bridge.dialog";
import { useLoginContext } from "../provider";

const Transfer = () => {
  const {
    handleClose,
    handleCopyAddress,
    handleNextStep,
    handleShow,
    show: showDialog,
    address,
  } = useTransfer();

  const { userBalance, refetchBalance } = useAppContext();
  const { referralCode } = useLoginContext();

  return (
    <>
      <div className="relative mx-auto">
        <Image alt="" src={iconEthereum} className="h-10 w-auto" />
      </div>
      <p className={clsx(styles.loginTitle, "labelText")}>Transfer ETH to Your new Wallet</p>
      <p className={clsx("normalText", styles.titleSpace)}>
        Send at least <span className="text-yellow">0.001 ETH</span> to your Coffee Club wallet via
        Base network. Coffee Club uses Account Abstraction wallets, learn more{" "}
        <a href="http://faq.coffeeclubapp.com" target="_blank" className="text-purple">
          here
        </a>
      </p>

      <p className={clsx(styles.titleSpace, "labelText textBlur")}>Deposit on Base Network</p>
      <p className="normalText">{address}</p>
      <div
        className="labelText textBlur mx-auto flex cursor-pointer items-center"
        onClick={handleCopyAddress}
      >
        <span>Tap to copy Address</span>
        <Image alt="" src={iconCopy} width={10} className="ml-1.5 h-auto opacity-50" />
      </div>

      <p className={clsx(styles.titleSpace, "text-20/28 font-bold")}>{`${formatCurrency(
        userBalance?.formatted || "0.00",
        8,
      )} ${userBalance?.symbol || "ETH"}`}</p>
      <div
        className="labelText textBlur mx-auto flex cursor-pointer items-center"
        onClick={refetchBalance}
      >
        <span>Tap to Refresh your Balance</span>
        <Image alt="" src={iconRefresh} width={10} className="ml-1.5 h-auto opacity-50" />
      </div>

      <div className="group-btn">
        <button className="btn btnGray" onClick={handleShow}>
          Want to deposit on Ethereum Mainnet?
        </button>
        <button className="btn btnBorder btnSpace" onClick={handleNextStep}>
          Next
        </button>
      </div>

      <BridgeDialog show={showDialog} handleClose={handleClose} referralCode={referralCode} />
    </>
  );
};

export default Transfer;
