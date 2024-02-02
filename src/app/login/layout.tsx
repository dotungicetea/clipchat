import dynamic from "next/dynamic";
import React from "react";

const LoginProvider = dynamic(() => import("./provider"), { ssr: false });

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return <LoginProvider>{children}</LoginProvider>;
};

export default LoginLayout;
