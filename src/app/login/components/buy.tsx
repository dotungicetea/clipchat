"use client";

import { useAppContext } from "@/providers/app.provider";
import { toastSuccess } from "@components/CustomToast";
import Drawer from "@components/Drawer";
import ViewSharesTransaction from "@components/ViewSharesTransaction";
import iconBuy from "@images/icon-key.svg";
import iconEthereumPink from "@images/icon-ethereum-pink.svg";
import iconMembership from "@images/icon-membership-cyan.svg";
import iconSwap from "@images/icon-swap.svg";
import { formatCurrency } from "@utils/index";
import clsx from "clsx";
import Image from "next/image";
import { useFirstBuy } from "../hooks/useFirstBuy";
import styles from "../login.module.scss";
import { useLoginContext } from "../provider";

const Buy = () => {
  const { userInfo, nextStep } = useLoginContext();
  const { address, userBalance } = useAppContext();

  const { confirmBuy, txHash, loadingTx, showConfirm, setShowConfirm, showTransaction } =
    useFirstBuy(address);

  const handleConfirm = async () => {
    const result = await confirmBuy?.();
    if (!result) return;

    toastSuccess(`Bought 1 key to ${userInfo?.name}'s Club`);
  };

  const handleDone = () => {
    nextStep();
  };

  return (
    <div className="min-h-fill relative flex h-screen flex-col">
      <div className="flex flex-1 flex-col pb-6">
        <div className="relative mx-auto h-10 w-fit">
          <Image alt="" src={iconBuy} />
        </div>
        <p className={clsx(styles.loginTitle, "labelText")}>Buy your First Key</p>
        <p className={clsx(styles.titleSpace, "normalText px-5")}>
          Tap below to buy the first key to your own Club for free.
        </p>
        <div className={"labelText mt-auto flex items-center justify-around"}>
          <div className={"flex items-center justify-center"}>
            <span className="textBlur mr-2.5">Total Price</span>
            <span className="">0.00 ETH</span>
          </div>
          <div className={"flex items-center justify-center"}>
            <span className="textBlur mr-2.5">Wallet Balance</span>
            <span className="">{`${formatCurrency(userBalance?.formatted || 0)} ${
              userBalance?.symbol || "ETH"
            }`}</span>
          </div>
        </div>
      </div>
      <div className="group-btn">
        <button className="btn btnCyan" onClick={() => setShowConfirm(true)}>
          Buy Key
        </button>
      </div>

      <Drawer show={showConfirm} className={"h-[36vh] min-h-[320px]"}>
        {showTransaction ? (
          <ViewSharesTransaction
            loadingTx={loadingTx}
            isBuying={true}
            amount={1}
            txHash={txHash}
            handleDone={handleDone}
            textDone="Continue"
          />
        ) : (
          <>
            <div className="relative flex flex-col border border-white/25">
              <div className="flex items-center border-b border-white/25 p-2.5 pr-4">
                <div className="mr-3 h-[35px] w-[35px] rounded-full bg-[#D9D9D9]">
                  <Image
                    alt=""
                    src={userInfo?.profileImage || userInfo?.avatar}
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                </div>

                <span className="">You</span>
                <div className="ml-auto flex items-center text-[#F15BB5]">
                  <span>-</span>
                  <Image
                    alt=""
                    src={iconEthereumPink}
                    width={8}
                    className="ml-[1px] mr-[5px] h-auto"
                  />
                  <span>0.00</span>
                </div>
              </div>
              <div className="flex items-center p-2.5 pr-4">
                <div className="mr-3 h-[35px] w-[35px] bg-[#D9D9D9]">
                  <Image
                    alt=""
                    src={userInfo?.profileImage || userInfo?.avatar}
                    width={35}
                    height={35}
                  />
                </div>
                <span className="">{`${userInfo?.name}'s Club`}</span>
                <div className="ml-auto flex items-center text-[#00F5D4]">
                  <span>+</span>
                  <Image
                    alt=""
                    src={iconMembership}
                    width={12}
                    className="ml-[1px] mr-[5px] h-auto"
                  />
                  <span>1</span>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Image alt="" src={iconSwap} width={18} className="ml-[5px] h-auto" />
              </div>
            </div>
            <p className={"normalText my-[25px] opacity-50"}>You are buying 1 key for 0.00 ETH</p>

            <button className="btn btnGray" onClick={handleConfirm}>
              Confirm Transaction
            </button>
            <button className="btn btnSpace" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Buy;
