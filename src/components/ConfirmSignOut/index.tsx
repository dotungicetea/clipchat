"use client";

import { post } from "@/request";
import Drawer from "@components/Drawer";
import Loading from "@components/PageLoading";
import { URLS } from "@constants/index";
import iconCat from "@images/icon-cat.svg";
import { clearAccountToken, clearFcmToken } from "@utils/index";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConnect, useDisconnect } from "wagmi";

type TConfirmSignOut = {
  show: boolean;
  handleClose: () => void;
  message?: string;
  resetStep?: () => void;
};

const DEFAULT_MESSAGE =
  "Are you sure you want to sign out? You will need to sign in again to manage your keys and Club. This does not delete your account.";

const ConfirmSignOut = (props: TConfirmSignOut) => {
  const { handleClose, show, message = DEFAULT_MESSAGE, resetStep } = props;
  const { push } = useRouter();
  const { connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false);

  const signOut = async () => {
    try {
      setLoadingSignOut(true);
      const res = await post("/logout");
      console.log("res logout", res);
    } finally {
      handleClose?.();
      try {
        await disconnectAsync();
        // const provider: ECDSAProvider = await connectors?.[0]?.getProvider();
        // if (provider) {
        //   console.log("disconnect", provider);
        //   provider.disconnect();
        // }
        clearAccountToken();
        clearFcmToken();
        resetStep?.();
        sessionStorage.clear();
      } catch (error) {
        console.log("err disconnect", error);
      } finally {
        setLoadingSignOut(false);
        push(URLS.LOGIN);
        localStorage.setItem("shouldReload", "true");
      }
    }
  };

  return (
    <>
      <Drawer
        show={show}
        handleCloseCoating={() => handleClose?.()}
        className={"h-[40vh] min-h-[340px]"}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto mt-4 rounded-full">
            <Image alt="" src={iconCat} width={32} className="h-auto" />
          </div>
          <p className={"normalText mt-3 font-bold capitalize text-white"}>Sign Out</p>
          <p className={"normalText textBlur my-[25px] max-w-md px-[15px] tracking-wide"}>
            {message}
          </p>
          <button className="btn btnGray" onClick={signOut} disabled={loadingSignOut}>
            Yes, Sign Out
          </button>
          <button
            className="btn btnSpace"
            onClick={() => handleClose?.()}
            disabled={loadingSignOut}
          >
            Cancel
          </button>
        </div>
      </Drawer>
      <Loading show={loadingSignOut} />
    </>
  );
};

export default ConfirmSignOut;
