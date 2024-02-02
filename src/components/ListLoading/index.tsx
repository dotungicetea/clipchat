"use client";

import iconCoffee from "@images/icon-cat.svg";
import Image from "next/image";

const ListLoading = ({ show = true }: { show?: boolean }) => {
  if (!show) return <></>;
  return (
    <div className="flex h-40 w-full flex-col items-center justify-center">
      <div className="relative mx-auto h-7 w-7">
        <Image alt="" src={iconCoffee} />
      </div>
      <p className="mt-2">Loading ...</p>
    </div>
  );
};

export default ListLoading;
