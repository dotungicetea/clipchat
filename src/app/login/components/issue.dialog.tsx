"use client";

import { useAppContext } from "@/providers/app.provider";
import { toastSuccess } from "@components/CustomToast";
import LoginDialog from "@components/LoginDialog";
import iconEthereum from "@images/icon-ethereum.svg";
import clsx from "clsx";
import Image from "next/image";
import styles from "../login.module.scss";

type TIssueDialog = {
  show: boolean;
  handleClose: () => void;
};

const IssueDialog = (props: TIssueDialog) => {
  const { show, handleClose } = props;
  const { address } = useAppContext();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toastSuccess("Coppied wallet address!");
  };

  return (
    <LoginDialog show={show}>
      <div className="container flex flex-col pt-[10vh]">
        <div className="flex flex-col">
          <div className="relative mx-auto">
            <Image alt="" src={iconEthereum} className="h-10 w-auto" />
          </div>
          <p className={clsx(styles.loginTitle, "labelText")}>Telegram Link Issue</p>
          <ol
            className={clsx(
              "normalText grid list-inside list-decimal grid-cols-1 gap-[2vh]",
              styles.titleSpace,
            )}
          >
            <li>Make sure you’re active with the same Telegram account provided previously</li>
            <li className="">
              Send a message to <span className="text-purple">@coffeeclubbot</span> with{" "}
              <span className="text-yellow">/start</span>
            </li>
            <li>Copy and paste your Coffee Club wallet address below to the bot chat</li>
            <li className="font-bold">
              <b>
                Type the command <span className="text-yellow">/finish</span>
              </b>
            </li>
          </ol>
          <p className="normalText my-[25px]">
            If you still have issues,{" "}
            <a href="http://faq.coffeeclubapp.com" className="text-purple" target="_blank">
              contact support
            </a>
          </p>
          <p className="normalText mt-auto">{address}</p>
        </div>

        <div className="login-footer">
          <button className="btn btnGray" onClick={handleCopyAddress}>
            Copy Wallet Address
          </button>
          <button className="btn btnBorder btnSpace" onClick={handleClose}>
            Back
          </button>
        </div>
      </div>
    </LoginDialog>
  );
};

export default IssueDialog;
