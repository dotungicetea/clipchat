"use client";

import iconBack from "@images/icon-back.svg";
import clsx from "clsx";
import Image from "next/image";
import { PropsWithChildren } from "react";

type TDialog = PropsWithChildren<{
  show: boolean;
  title?: string;
  handleBack?: () => void;
  showHeader?: boolean;
}>;
const Dialog = ({ children, show, handleBack, title, showHeader = true }: TDialog) => {
  return (
    <div
      className={clsx(
        "fixed left-0 top-0 z-10 h-screen w-full max-w-md -translate-x-1/2 transform bg-black p-[15px] pt-0 duration-500 ease-in-out",
        show ? "left-1/2 opacity-100" : "left-full translate-x-0 opacity-0",
      )}
    >
      {showHeader ? (
        <>
          <div className="relative flex w-full items-center justify-center py-5">
            <div
              className="absolute left-0 flex cursor-pointer items-center"
              onClick={() => handleBack?.()}
            >
              <Image alt="" src={iconBack} width={8} className="h-auto" />
              <p className="ml-2.5">Back</p>
            </div>
            <p className="font-bold">{title || ""}</p>
          </div>

          <div className="no-scrollbar h-fill flex max-h-[calc(100vh-84px)] w-full flex-col bg-black">
            {children}
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default Dialog;
