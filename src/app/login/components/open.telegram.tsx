"use client";

import iconTelegram from "@images/icon-telegram.svg";
import clsx from "clsx";
import Image from "next/image";
import { useConfirmTele } from "../hooks/useConfirmTele";
import styles from "../login.module.scss";
import { useLoginContext } from "../provider";
import IssueDialog from "./issue.dialog";

const OpenTelegram = () => {
  const { nextStep } = useLoginContext();
  const { show, isOpened, handleShow, handelOpenTele, handleClose } = useConfirmTele();

  return (
    <div className="min-h-fill relative flex h-screen flex-col">
      <div className="flex flex-1 flex-col px-[15px] pb-[25px]">
        <div className="relative mx-auto h-10 w-fit">
          <Image alt="" src={iconTelegram} />
        </div>
        <p className={clsx(styles.loginTitle, "labelText")}>Open Telegram</p>
        <p className={clsx(styles.titleSpace, "normalText")}>
          Open Telegram to message the Coffee Club Bot @coffeeclubbot, then type /start
        </p>
        <p className={clsx("normalText mt-auto")}>
          Click{" "}
          <span className="cursor-pointer text-purple" onClick={handleShow}>
            here
          </span>{" "}
          if there are issues linking your Telegram account
        </p>
      </div>

      <div className={styles.groupBtn}>
        <button className="btn btnGray" onClick={handelOpenTele}>
          Open Telegram
        </button>
        <button
          className={clsx("btn btnSpace", isOpened ? "btnGray" : "btnBorder")}
          onClick={() => nextStep?.()}
          disabled={!isOpened}
        >
          Continue
        </button>
      </div>
      <IssueDialog handleClose={handleClose} show={show} />
    </div>
  );
};

export default OpenTelegram;
