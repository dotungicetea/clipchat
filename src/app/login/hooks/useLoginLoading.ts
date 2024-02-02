"use client";

import { useCallback, useState } from "react";

const useLoginLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("loading", "true");
    setLoading(true);
  }, []);
  const removeLoading = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("loading");
    setLoading(false);
  }, []);

  return {
    loading,
    startLoading,
    removeLoading,
  };
};

export default useLoginLoading;
