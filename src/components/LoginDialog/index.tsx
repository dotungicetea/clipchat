"use client";

import clsx from "clsx";
import React, { PropsWithChildren } from "react";

type TLoginDialog = PropsWithChildren<{
  show: boolean;
}>;
const LoginDialog = ({ children, show }: TLoginDialog) => {
  return (
    <div
      className={clsx(
        "fixed left-0 top-0 z-10 h-screen w-full max-w-md -translate-x-1/2 transform bg-black duration-500 ease-in-out",
        show ? "left-1/2 opacity-100" : "left-full translate-x-0 opacity-0",
      )}
    >
      <div className="container flex w-full flex-col p-[15px] pt-10">{children}</div>
    </div>
  );
};

export default LoginDialog;
