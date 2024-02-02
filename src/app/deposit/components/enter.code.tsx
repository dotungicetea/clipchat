"use client";

import { get } from "@/request";
import { toastError } from "@components/CustomToast";
import iconEthereum from "@images/icon-ethereum.svg";
import clsx from "clsx";
import Image from "next/image";
import { ChangeEvent, useCallback, useState } from "react";
import { useBridgeContext } from "../provider";

const EnterCode = () => {
  const { nextStep, setCoffeeAddress } = useBridgeContext();
  const [inputCode, setInputCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleContinue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await get(`/${inputCode}/wallet-address`);
      console.log({ res });
      const walletRefCode = res?.data?.walletAddress;
      console.log("get address", walletRefCode);
      setCoffeeAddress(walletRefCode);
      setLoading(false);
      nextStep?.();
    } catch (error) {
      setLoading(false);
      toastError(error?.message || "Referral Code not found!");
    }
  }, [inputCode, nextStep, setCoffeeAddress]);

  const handleChangeTele = (e: ChangeEvent<HTMLInputElement>) => {
    setInputCode(e.target.value);
  };

  return (
    <>
      <div className="relative mx-auto mt-[15vh]">
        <Image alt="" src={iconEthereum} className="h-10 w-auto" />
      </div>
      <p className={clsx("labelText mt-[15px]")}>Deposit on ETH mainnet</p>
      <p className={clsx("normalText mt-[5vh]")}>Enter the code from you in-app wallet.</p>
      <input
        type="text"
        style={{ borderRadius: "16px", backgroundColor: "#ffffff99", color: "black" }}
        placeholder="Enter code here"
        className={"inputText titleText btnGray mt-10 w-full tracking-widest"}
        value={inputCode}
        onChange={handleChangeTele}
        autoFocus
      />
      <div className="fixed bottom-0 left-1/2 min-h-[140px] w-full max-w-md -translate-x-1/2 px-[15px] pb-5 pt-[15px]">
        <button
          style={{
            borderRadius: 8,
            width: "100%",
            height: 40,
            backgroundColor: "white",
            color: "black",
            fontWeight: 700,
          }}
          // className={clsx("btn mt-10", !!inputCode ? "btnGray" : "btnBorder")}
          onClick={handleContinue}
          disabled={!inputCode || loading}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default EnterCode;
