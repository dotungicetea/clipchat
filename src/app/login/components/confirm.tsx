"use client";

import iconAdmin from "@images/icon-admin.svg";
import clsx from "clsx";
import Image from "next/image";
import { useConfirmTele } from "../hooks/useConfirmTele";
import styles from "../login.module.scss";

const Confirm = () => {
  const { loadingCheck, handleCheckUserJoined } = useConfirmTele();

  return (
    <div className="min-h-fill relative flex h-screen flex-col">
      <div className="flex flex-1 flex-col pb-[25px]">
        <div className="relative mx-auto h-10 w-fit">
          <Image alt="" src={iconAdmin} />
        </div>
        <p className={clsx(styles.loginTitle, "labelText")}>Become an Admin for your Club</p>
        <p className={clsx(styles.titleSpace, "normalText")}>
          1. Request to join your own Club via invite link provided by the bot
        </p>
        <p className={clsx("normalText mt-[25px]")}>
          2. Type <span className="text-yellow">/finish</span>
        </p>
      </div>

      <div className={styles.groupBtn}>
        <button
          className="btn btnGray"
          onClick={() => handleCheckUserJoined?.()}
          disabled={loadingCheck}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Confirm;
