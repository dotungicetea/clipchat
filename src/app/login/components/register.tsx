"use client";

import iconImportant from "@images/icon-important.svg";
import iconTelegram from "@images/icon-telegram.svg";
import clsx from "clsx";
import Image from "next/image";
import useRegister from "../hooks/useRegister";
import styles from "../login.module.scss";
import { useLoginContext } from "../provider";

export default function Register() {
  const { nextStep } = useLoginContext();

  const {
    isSubmitted,
    loadingRegister,
    isRegistered,
    handleChangeTele,
    handleRegister,
    handleEditTele,
    inputRef,
    telegram,
    setIsSubmitted,
  } = useRegister();

  if (isRegistered)
    return (
      <>
        <div className="relative mx-auto h-10 w-fit">
          <Image alt="" src={iconImportant} />
        </div>
        <p className={clsx(styles.loginTitle, "labelText")}>Important</p>
        <p className={clsx("normalText", styles.titleSpace)}>
          Please make sure your current active session on Telegram is the same username provided in
          the previous step. After you’ve confirmed you’re active on the correct account, click
          below to continue.
        </p>
        <div className="group-btn">
          <button className="btn btnGray" onClick={() => nextStep?.()}>
            I’m on the correct Telegram session
          </button>
        </div>
      </>
    );

  return (
    <>
      <div className="relative mx-auto h-10 w-fit">
        <Image alt="" src={iconTelegram} />
      </div>
      <p className={clsx(styles.loginTitle, "labelText")}>
        {isSubmitted ? "Confirm Telegram" : "Link Your Telegram"}
      </p>
      <p className={clsx("normalText", styles.titleSpace)}>
        {isSubmitted
          ? "You can't unlink or change your Telegram account after this. Please make sure you entered your correct Telegram username."
          : "Link your Telegram account to the Coffee Club Telegram bot. Submit your Telegram username."}
      </p>

      <div
        className={clsx(
          "mt-10 flex w-full items-center justify-center",
          isSubmitted ? "bg-transparent text-[#FEE440]" : "btnGray",
        )}
        onClick={() => inputRef?.current?.focus()}
      >
        <span className="">@</span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          className={clsx("inputText titleText bg-transparent !opacity-100")}
          value={telegram}
          onChange={handleChangeTele}
          disabled={isSubmitted}
        />
      </div>

      {isSubmitted ? (
        <>
          <button
            className="btn btnYellow mt-2.5"
            onClick={() => handleRegister()}
            disabled={loadingRegister}
          >
            I understand this is permanent
          </button>
          <button className="btn btnSpace" onClick={handleEditTele} disabled={loadingRegister}>
            Edit Telegram Username
          </button>
        </>
      ) : (
        <button
          className={clsx("btn mt-2.5", !!telegram ? "btnGray" : "btnBorder")}
          onClick={() => setIsSubmitted(true)}
          disabled={!telegram}
        >
          Submit Telegram Username
        </button>
      )}
    </>
  );
}
