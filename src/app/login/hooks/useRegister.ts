"use client";

import { put } from "@/request";
import { toastError } from "@components/CustomToast";
import { getUserData, saveUserData } from "@utils/index";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLoginContext } from "../provider";

const useRegister = () => {
  const { address } = useLoginContext();

  const inputRef = useRef<null | HTMLInputElement>(null);

  const [telegram, setTelegram] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.style.width = input.value.length + 1 + "ch"; /* Set width based on value length */
    }
  }, [telegram]);

  const getTelegramUsername = (input: string) => {
    const trimedInput = input.trim();
    if (trimedInput.startsWith("@")) {
      return trimedInput.slice(1);
    } else {
      return trimedInput;
    }
  };

  const handleEditTele = () => {
    setIsSubmitted(false);
    inputRef?.current.focus();
  };

  const handleRegister = async () => {
    setLoadingRegister(true);
    try {
      const res = await put("/update-telegram", {
        body: {
          telegram: getTelegramUsername(telegram),
        },
        needAuth: true,
      });
      console.log("res update-telegram", res);
      setLoadingRegister(false);
      const userData = getUserData();
      saveUserData(address, userData?.token, {
        ...userData?.user,
        telegram: res?.data?.telegram,
      });
      setIsRegistered(true);
    } catch (error) {
      console.log("error", error);
      setLoadingRegister(false);
      toastError(error?.message);
    }
  };

  const handleChangeTele = (e: ChangeEvent<HTMLInputElement>) => {
    setTelegram(e.target.value);
  };

  return {
    isSubmitted,
    loadingRegister,
    isRegistered,
    handleChangeTele,
    handleRegister,
    handleEditTele,
    inputRef,
    telegram,
    setIsSubmitted,
  };
};

export default useRegister;
