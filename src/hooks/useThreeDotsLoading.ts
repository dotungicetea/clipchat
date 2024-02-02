"use client";

import { useEffect, useState } from "react";

const useThreeDotsLoading = () => {
  const minDot = 0;
  const maxDot = 3;
  const [dotAmount, setDotAmount] = useState<number>(minDot);

  useEffect(() => {
    const timer = setInterval(() => {
      setDotAmount((prev) => {
        const newAmount = prev + 1;
        return newAmount > maxDot ? minDot : newAmount;
      });
    }, 500);

    const resetTimer = setTimeout(() => {
      setDotAmount(minDot);
    }, 2000); // 500ms * 4 dots = 2000ms

    return () => {
      clearInterval(timer);
      clearTimeout(resetTimer);
    };
  }, []);

  return ".".repeat(dotAmount);
};

export default useThreeDotsLoading;
