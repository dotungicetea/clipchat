"use client";

import { useMemo } from "react";
import About from "./components/about";
import Buy from "./components/buy";
import Confirm from "./components/confirm";
import Notification from "./components/notification";
import OpenTelegram from "./components/open.telegram";
import Referral from "./components/referral";
import Register from "./components/register";
import Transfer from "./components/tranfer";
import { LOGIN_STEP } from "./hooks/useLogin";
import { useLoginContext } from "./provider";

// const About = dynamic(() => import("./about"), { ssr: false });
// const Buy = dynamic(() => import("./buy"), { ssr: false });
// const Confirm = dynamic(() => import("./confirm"), { ssr: false });
// const Notification = dynamic(() => import("./notification"), { ssr: false });
// const Referral = dynamic(() => import("./referral"), { ssr: false });
// const Register = dynamic(() => import("./register"), { ssr: false });
// const Transfer = dynamic(() => import("./tranfer"), { ssr: false });

export default function Login() {
  const { address, currStep } = useLoginContext();

  const StepElement = useMemo(() => {
    switch (currStep) {
      case LOGIN_STEP.ALLOW_PERMISSIONS:
        return <Notification />;
      case LOGIN_STEP.TRANSFER_ETH:
        return <Transfer />;
      case LOGIN_STEP.BUY_MEMBERSHIP:
        return <Buy />;
      case LOGIN_STEP.REGISTER_TELEGRAM:
        return <Register />;
      case LOGIN_STEP.TELEGRAM_ISSUE:
        return <OpenTelegram />;
      case LOGIN_STEP.CONFIRM_JOIN:
        return <Confirm />;
      case LOGIN_STEP.REFERRAL:
        return <Referral address={address} />;
      case LOGIN_STEP.SIGN_IN:
      default:
        return <About />;
    }
  }, [address, currStep]);

  return <div className="min-h-fill flex h-screen flex-col pt-[15vh]">{StepElement}</div>;
}
