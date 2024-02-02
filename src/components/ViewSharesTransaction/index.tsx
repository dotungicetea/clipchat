"use client";

import useThreeDotsLoading from "@hooks/useThreeDotsLoading";
import iconCat from "@images/icon-cat.svg";
import { getSuffix, getTransactionLink } from "@utils/index";
import clsx from "clsx";
import Image from "next/image";

type TViewSharesTransaction = {
  loadingTx: boolean;
  isBuying: boolean;
  amount: number;
  txHash: string;
  handleDone: () => void;
  textDone?: string;
};

const ViewSharesTransaction = (props: TViewSharesTransaction) => {
  const { isBuying, loadingTx, amount, txHash, handleDone, textDone = "Done" } = props;

  const dotLoading = useThreeDotsLoading();

  const viewTransaction = () => {
    window.open(getTransactionLink(txHash));
  };

  return (
    <>
      <div className="mx-auto mt-2 rounded-full">
        <Image alt="" src={iconCat} width={32} className="h-auto" />
      </div>
      <div className="mt-[15px] flex items-center justify-center text-center">
        {loadingTx ? (
          <>
            <p>{`${isBuying ? "Buy" : "Sell"}ing ${amount} key${getSuffix(amount)}`}</p>
            <div className="">{dotLoading}</div>
          </>
        ) : (
          `${isBuying ? "Bought" : "Sold"} ${amount} key${getSuffix(amount)} ✔`
        )}
      </div>
      <p className={clsx("my-[25px] px-3 text-center opacity-50")}>
        It may take a moment for your transaction to execute. You can check the status of this
        transaction below.
      </p>
      <button className="btn btnGray mt-5" onClick={viewTransaction} disabled={loadingTx}>
        View Transaction
      </button>
      <button className="btn btnSpace" onClick={() => handleDone?.()} disabled={loadingTx}>
        {textDone}
      </button>
    </>
  );
};

export default ViewSharesTransaction;
