import dynamic from "next/dynamic";
import React from "react";

const BridgeProvider = dynamic(() => import("./provider"), { ssr: false });

const BridgeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BridgeProvider>{children}</BridgeProvider>
    </>
  );
};

export default BridgeLayout;
