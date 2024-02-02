"use client";

import iconNotification from "@images/icon-notification.svg";
import clsx from "clsx";
import Image from "next/image";
import useFirebase from "../hooks/useFirebase";
import styles from "../login.module.scss";
import { useLoginContext } from "../provider";

const Notification = () => {
  const { nextStep } = useLoginContext();
  const { allowNotifications, loadingAllow } = useFirebase(nextStep);

  return (
    <>
      <div className="relative mx-auto h-10 w-fit">
        <Image alt="" src={iconNotification} />
      </div>
      <p className={clsx(styles.loginTitle, "labelText")}>Allow Notifications</p>
      <p className={clsx(styles.titleSpace, "normalText")}>
        {`Get notifications when you're accepted into a private club or when people are waiting to join yours.`}
      </p>
      <div className="group-btn">
        <button
          className="btn btnGray"
          onClick={() => allowNotifications?.()}
          disabled={loadingAllow}
        >
          Allow Notifications
        </button>
        <button className="btn btnSpace" onClick={() => nextStep?.()}>
          Skip
        </button>
      </div>
    </>
  );
};

export default Notification;
