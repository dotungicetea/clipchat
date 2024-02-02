"use client";

import { useAppContext } from "@/providers/app.provider";
import { useLoginContext } from "../provider";
import { LOGIN_STEP } from "../hooks/useLogin";
import { useEffect, useRef, useState } from "react";

const LoginHeader = ({ show }: { show: boolean }) => {
  const { currStep, handleShowSignOutDialog } = useLoginContext();

  const [progressWidth, setProgressWidth] = useState<string>("0px");
  const progressRef = useRef<HTMLDivElement | null>(null);

  // get progress width
  useEffect(() => {
    if (!progressRef?.current) return;

    const totalW = progressRef.current.offsetWidth;
    if (currStep === LOGIN_STEP.REFERRAL) {
      setProgressWidth(totalW + "px");
      return;
    }
    const gapW = 5;
    const stepW = Math.floor((totalW - gapW * 4) / 5);
    const stepAmount = currStep - 1.5;
    const activeW = stepAmount * stepW + Math.floor(stepAmount) * gapW;
    setProgressWidth(activeW + "px");
  }, [currStep, progressRef]);

  if (!show) return <></>;
  return (
    <div className="login-header flex w-full items-center py-[15px]">
      <div className="relative flex h-[3px] flex-1 bg-[#FFFFFF26]">
        <div
          className="absolute left-0 top-0 z-[2] h-[3px] w-full bg-[#FFFFFF80] duration-500 ease-in"
          style={{
            width: progressWidth,
          }}
        ></div>
        <div
          ref={progressRef}
          className="absolute left-0 top-0 z-[3] flex h-[3px] w-full justify-between"
        >
          <div className=""></div>
          <div className="h-[3px] w-[5px] bg-black"></div>
          <div className="h-[3px] w-[5px] bg-black"></div>
          <div className="h-[3px] w-[5px] bg-black"></div>
          <div className="h-[3px] w-[5px] bg-black"></div>
          <div className=""></div>
        </div>
      </div>

      <button
        className="no ml-8 bg-transparent text-12/20 outline-none"
        onClick={() => handleShowSignOutDialog?.()}
      >
        Sign Out
      </button>
    </div>
  );
};

export default LoginHeader;
