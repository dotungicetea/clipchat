"use client";

import iconCat from "@images/icon-cat.svg";
import clsx from "clsx";
import Image from "next/image";

type TLoading = {
  show?: boolean;
  loadingText?: string;
};

const Loading = (props: TLoading) => {
  const { show = true, loadingText } = props;

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-1/2 top-0 z-50 w-screen -translate-x-1/2 transform bg-black",
        show ? "flex" : "hidden",
      )}
    >
      <div className="labelText -mt-10 flex w-full flex-col items-center justify-center text-center text-white">
        <Image alt="" src={iconCat} height={40} className="w-auto" />
        {!!loadingText ? (
          <p className="mt-2">{loadingText}</p>
        ) : (
          <>
            <p className="mt-2">Coffee Club</p>
            <p className="-mt-1.5">A Marketplace for your friend group</p>
          </>
        )}
        <div className="dot-loading mt-2"></div>
      </div>
    </div>
  );
};

export default Loading;
