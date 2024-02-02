"use client";

import { useAppContext } from "@/providers/app.provider";
import { toastSuccess } from "@components/CustomToast";
import LoginDialog from "@components/LoginDialog";
import { URLS } from "@constants/index";
import iconCopy from "@images/icon-copy.svg";
import iconEthereum from "@images/icon-ethereum.svg";
import iconRefresh from "@images/icon-refresh.svg";
import { formatCurrency } from "@utils/index";
import clsx from "clsx";
import Image from "next/image";
import styles from "../login.module.scss";

type TBridgeDialog = {
  show: boolean;
  handleClose: () => void;
  referralCode: string;
};

const BridgeDialog = (props: TBridgeDialog) => {
  const { show, handleClose, referralCode } = props;
  const { userBalance, refetchBalance } = useAppContext();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    toastSuccess("Coppied wallet address!");
  };

  const depositLink = window.location.host + URLS.BRIDGE;

  const handleCopyLink = () => {
    console.log("link", depositLink);
    navigator.clipboard.writeText(depositLink);
    toastSuccess("Coppied url!");
  };

  return (
    <LoginDialog show={show}>
      <div className="container flex flex-col pt-[12vh]">
        <div className="flex flex-col items-center text-center">
          <div className="relative mx-auto">
            <Image alt="" src={iconEthereum} className="h-10 w-auto" />
          </div>
          <p className={clsx(styles.loginTitle, "labelText")}>Deposit on ETH mainnet</p>
          <p className={clsx("normalText cursor-pointer", styles.titleSpace)}>
            Please open{" "}
            <span className="text-purple" onClick={handleCopyLink}>
              {depositLink}
            </span>{" "}
            on your mobile dApp browser or desktop and enter this code to continue.
          </p>

          <p className={clsx(styles.titleSpace, "text-20/28 font-bold")}>{referralCode}</p>
          <div
            className="labelText textBlur mx-auto flex cursor-pointer items-center"
            onClick={handleCopy}
          >
            <span>Tap to copy code</span>
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
        </div>

        <div className="login-footer">
          <button className="btn btnBorder mt-10" onClick={handleClose}>
            Back
          </button>
        </div>
      </div>
    </LoginDialog>
  );
};

export default BridgeDialog;
