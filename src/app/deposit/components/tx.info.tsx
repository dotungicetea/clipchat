"use client";

import { ETHERSCAN_URL, L1_ETHERSCAN_URL } from "@constants/index";
import React from "react";

const L2_EXPLORER_URL = ETHERSCAN_URL;

enum TxStatus {
  Pending,
  Confirmed,
}

function TxInfo({ isL1, txHash, txStatus }: { isL1: boolean; txHash: string; txStatus: TxStatus }) {
  return (
    <div className="flex items-center text-center">
      <p>
        {isL1 ? "L1" : "L2"} tx {txStatus == TxStatus.Pending ? "pending..." : "confirmed!"}
        {" ➔"}
      </p>
      <a
        href={`${isL1 ? L1_ETHERSCAN_URL : L2_EXPLORER_URL}/tx/${txHash}`}
        target="_blank"
        rel="noreferrer"
        className="text-decoration:underline pl-2 text-purple"
      >
        view transaction
      </a>
    </div>
  );
}

export default TxInfo;
