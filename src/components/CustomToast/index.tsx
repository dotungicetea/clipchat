"use client";

import iconError from "@images/icon-error.svg";
import logo from "@images/icon-cat.svg";
import Image from "next/image";
import { toast } from "react-toastify";

const MsgError = ({ message }) => (
  <div className="flex flex-col font-mono">
    <div className="flex items-center">
      <Image src={iconError} alt="" width={10} className="h-auto" />
      <p className="labelText ml-1.5 font-semibold leading-5">Error!</p>
    </div>
    <p className="mt-1 whitespace-pre-line text-10/14">{message || "Something went wrong!"}</p>
  </div>
);

export const toastError = (message: string) => {
  toast(<MsgError message={message} />, {
    className: "!text-black !bg-[#ffffff] backdrop-blur-[37px]",
  });
};
const MsgSucess = ({ message, title }) => (
  <div className="flex flex-col font-mono">
    <div className="flex items-center">
      <Image src={logo} alt="" width={14} className="h-auto" />
      <p className="ml-2 uppercase leading-5">{title}</p>
    </div>
    <p className="whitespace-pre-line tracking-wide">{message}</p>
  </div>
);

export const toastSuccess = (message: string, title = "Coffee Club") => {
  toast(<MsgSucess message={message} title={title} />, {
    style: {
      display: "flex",
      flexDirection: "column",
      background: "#202020",
      backgroundBlendMode: "overlay, normal",
      backdropFilter: "blur(75px)",
      fontSize: "10px",
      lineHeight: "15px",
    },
  });
};
