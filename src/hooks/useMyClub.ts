"use client";

import { getUserData } from "@utils/index";
import { useEffect, useState } from "react";

const useMyClub = () => {
  const [refetch, setRefetch] = useState<boolean>(false);
  const [myClub, setMyClub] = useState<any>();

  useEffect(() => {
    (async () => {
      const token = getUserData()?.token;
      if (!token) return;
      try {
        const response = await fetch(`/api/api/clubs/my-club`, {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }),
          credentials: "include",
        });
        const res = await response?.json();
        console.log("myClub", res?.data);
        setMyClub(res?.data);
      } catch (error) {
        console.log("err myClub", error);
      }
    })();
  }, [refetch]);

  const refetchMyClub = () => {
    setRefetch(!refetch);
  };

  return { myClub, refetchMyClub };
};

export default useMyClub;
