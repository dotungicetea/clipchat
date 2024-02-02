"use client";

import Loading from "@components/PageLoading";
import iconReferral from "@images/icon-referral.svg";
import clsx from "clsx";
import Image from "next/image";
import { Address } from "wagmi";
import { useReferral } from "../hooks/useReferral";
import styles from "../login.module.scss";

type TReferral = {
  address: Address;
};
export default function Referral(props: TReferral) {
  const { address } = props;
  const { handleChangeCode, handleSubmit, referralCode, skip, loading } = useReferral(address);

  return (
    <>
      <div className="relative mx-auto h-10 w-fit">
        <Image alt="" src={iconReferral} />
      </div>
      <p className={clsx(styles.loginTitle, "labelText")}>Referral Code</p>
      <p className={clsx(styles.titleSpace, "normalText")}>
        Did a friend invite you? Add the referral code below. Don’t forget to refer members to your
        Coffee Club to earn royalties.
      </p>

      <input
        type="text"
        className={"btnGray inputText mt-10"}
        value={referralCode}
        onChange={handleChangeCode}
        autoFocus
      />

      <button
        className={clsx("btn mt-2.5", !!referralCode ? "btnGray" : "btnBorder")}
        onClick={handleSubmit}
        disabled={!referralCode}
      >
        Submit Referral Code
      </button>

      <button className={"btn btnSpace"} onClick={skip}>
        Skip
      </button>
      <Loading show={loading} loadingText="Checking Referral..." />
    </>
  );
}
