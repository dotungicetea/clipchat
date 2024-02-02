"use client";

import { toastSuccess } from "@components/CustomToast";
import iconEthereumCyan from "@images/icon-ethereum-cyan.svg";
import iconEthereumPink from "@images/icon-ethereum-pink.svg";
import iconInfoWhite from "@images/icon-info-white.svg";
import iconInfo from "@images/icon-info.svg";
import iconMembershipCyan from "@images/icon-membership-cyan.svg";
import iconMembershipPink from "@images/icon-membership-pink.svg";
import iconSwap from "@images/icon-swap.svg";
import { formatCurrency, getSuffix } from "@utils/index";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import Image from "next/image";
import { Dispatch, SetStateAction, useMemo } from "react";

type TConfirmSharesTransaction = {
  confirm: () => Promise<boolean>;
  isBuying: boolean;
  amount: number;
  clubDetail: any;
  userInfo: any;
  price: any;
  setShowConfirm: Dispatch<SetStateAction<boolean>>;
  showFeeInfo?: boolean;
  toggleFeeInfo?: () => void;
};

const ConfirmSharesTransaction = (props: TConfirmSharesTransaction) => {
  const {
    isBuying,
    amount,
    userInfo,
    clubDetail,
    price,
    confirm,
    setShowConfirm,
    showFeeInfo,
    toggleFeeInfo,
  } = props;

  const displayPrice = useMemo(() => {
    const priceWithoutFee = !!price ? BigNumber(price).div(1.1) : 0;
    const ownerFee = BigNumber(priceWithoutFee).multipliedBy(0.06);
    const platformFee = BigNumber(priceWithoutFee).multipliedBy(0.04);

    return {
      totalPrice: formatCurrency(price),
      priceWithoutFee: formatCurrency(priceWithoutFee),
      ownerFee: formatCurrency(ownerFee),
      platformFee: formatCurrency(platformFee),
    };
  }, [price]);

  const handleConfirm = async () => {
    const result = await confirm?.();

    if (result) {
      const buyMsg = `Bought ${amount} key${getSuffix(amount)} to ${clubDetail?.title}`;
      const sellMsg = `Sold ${amount} key${getSuffix(amount)} to ${clubDetail?.title}`;
      toastSuccess(isBuying ? buyMsg : sellMsg);
    }
  };

  return (
    <>
      <div className="relative flex flex-col border border-white/25">
        <div className="flex items-center border-b border-white/25 p-2.5 pr-4">
          <div className="mr-3 h-[35px] w-[35px] bg-[#D9D9D9]">
            {clubDetail?.owner?.avatar && (
              <Image alt="" src={clubDetail?.owner?.avatar} width={35} height={35} />
            )}
          </div>
          <span className="">{clubDetail?.title}</span>
          <div
            className={clsx(
              "ml-auto flex items-center",
              isBuying ? "text-[#00F5D4]" : "text-[#F15BB5]",
            )}
          >
            <span className="-mt-0.5 mr-0.5">{isBuying ? "+" : "-"}</span>
            <Image
              alt=""
              src={isBuying ? iconMembershipCyan : iconMembershipPink}
              width={12}
              className="ml-[1px] mr-[5px] h-auto"
            />
            <span>{amount}</span>
          </div>
        </div>
        <div className="flex items-center p-2.5 pr-4">
          <div className="mr-3 h-[35px] w-[35px] rounded-full bg-[#D9D9D9]">
            {userInfo?.avatar && (
              <Image
                alt=""
                src={userInfo?.avatar}
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
          </div>

          <span className="">You</span>
          <div
            className={clsx(
              "ml-auto flex items-center justify-center",
              !isBuying ? "text-[#00F5D4]" : "text-[#F15BB5]",
            )}
          >
            <span className="-mt-0.5 mr-0.5">{!isBuying ? "+" : "-"}</span>
            <Image
              alt=""
              src={isBuying ? iconEthereumPink : iconEthereumCyan}
              width={8}
              className="ml-[1px] mr-[5px] h-auto"
            />
            <span>{displayPrice.totalPrice}</span>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image alt="" src={iconSwap} width={18} className="ml-[5px] h-auto" />
        </div>
      </div>
      <div className="flex flex-col justify-center text-center">
        <div className="mt-[25px] flex w-full items-center justify-center">
          <p className={"opacity-50"}>
            {`You are ${isBuying ? "Buy" : "Sell"}ing ${amount} key${getSuffix(amount)} for ${
              displayPrice.totalPrice
            } ETH`}
          </p>
          {isBuying && (
            <Image
              alt=""
              src={showFeeInfo ? iconInfo : iconInfoWhite}
              width={11}
              className="ml-[5px] h-auto cursor-pointer"
              onClick={() => toggleFeeInfo?.()}
            />
          )}
        </div>
        {isBuying && (
          <div
            className={clsx(
              "mt-2.5 flex-col opacity-50",
              showFeeInfo ? "flex" : "hidden delay-500",
            )}
          >
            <p>{`6% of ${displayPrice.priceWithoutFee} ETH ➔ ${displayPrice.ownerFee} ➔ ${clubDetail?.owner?.name}`}</p>
            <p>{`4% of ${displayPrice.priceWithoutFee} ETH ➔ ${displayPrice.platformFee} ➔ Platform`}</p>
          </div>
        )}
      </div>

      <button className="btn btnGray mt-[25px]" onClick={handleConfirm}>
        Confirm Transaction
      </button>
      <button className="btn btnSpace" onClick={() => setShowConfirm(false)}>
        Cancel
      </button>
    </>
  );
};

export default ConfirmSharesTransaction;
