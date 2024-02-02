"use client";

import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";

const useReconnect = () => {
  const { connectAsync, connectors } = useConnect();
  const { connector } = useAccount();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!connectors?.[0]) return;
      try {
        console.log("connector", connector);
        if (connector !== undefined) return;

        const res = await connectAsync({
          connector: connectors[0],
        });
        console.log("reconnecting", res);
      } catch (error) {
        console.log("error reconnect", error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [connectAsync, connector, connectors]);
};

export default useReconnect;
