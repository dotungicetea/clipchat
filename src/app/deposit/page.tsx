"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import styles from "./bridge.module.scss";
import { BRIDGE_STEPS, useBridgeContext } from "./provider";

const EnterCode = dynamic(() => import("./components/enter.code"), { ssr: false });
const Bridge = dynamic(() => import("./components/bridge"), { ssr: false });

const BridgePage = () => {
  const { currStep } = useBridgeContext();

  const StepElement = useMemo(() => {
    switch (currStep) {
      case BRIDGE_STEPS.BRIDGE:
        return <Bridge />;
      case BRIDGE_STEPS.ENTER_CODE:
      default:
        return <EnterCode />;
    }
  }, [currStep]);

  return (
    <div className={styles.bgGradient}>
      <div
        style={{ backgroundSize: "100%" }}
        className={clsx(
          styles.bgImage,
          "h-fill flex h-screen flex-col items-center px-[15px] text-center",
        )}
      >
        {StepElement}
      </div>
    </div>
  );
};

export default BridgePage;
