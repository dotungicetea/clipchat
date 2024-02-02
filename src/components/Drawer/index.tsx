"use client";

import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface DrawerProps {
  show: boolean;
  handleCloseCoating?: () => void;
  className?: string;
  disableBgBlur?: boolean;
}

const Drawer = ({
  children,
  show,
  handleCloseCoating,
  disableBgBlur,
  className,
}: PropsWithChildren<DrawerProps>) => {
  return (
    <>
      <div
        className={clsx(
          disableBgBlur ? "" : "bg-black/80",
          show ? "fixed left-0 top-0 z-30 h-screen w-full max-w-[100vw] flex-1" : "hidden",
        )}
        onClick={() => handleCloseCoating?.()}
      ></div>

      <div
        className={clsx(
          "fixed bottom-0 left-0 z-40 flex w-full flex-col bg-[#262727] transition-all duration-500",
          show ? "translate-y-0 p-[15px] opacity-100" : "translate-y-full opacity-0",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
};

export default Drawer;
