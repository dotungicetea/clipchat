"use client";

import { useAppContext } from "@/providers/app.provider";
import { post } from "@/request";
import { toastError, toastSuccess } from "@components/CustomToast";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const useWaitlist = (clubId?: string | number) => {
  const { refetchMyClub } = useAppContext();
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false);
  const [loadingReject, setLoadingReject] = useState<boolean>(false);
  const [waitList, setWaitList] = useState<any[]>([]);

  const {
    data: dataWait,
    loading: loadingData,
    mutate,
  } = useFetch(`/clubs/${clubId}/pending-members`, !!clubId);

  useEffect(() => {
    if (!dataWait) return;
    setWaitList(dataWait?.data || []);
  }, [dataWait]);

  const onApprove = async (
    clubId: string | number | undefined,
    pendingId: string | number | undefined,
    pendingName?: string | undefined,
  ) => {
    if (!pendingId || !clubId) return;
    setLoadingApprove(true);
    console.log("on approve", clubId, pendingId);
    try {
      await post(`/clubs/${clubId}/approve/${pendingId}`, {
        needAuth: true,
        body: {
          isApproved: true,
        },
      });
      toastSuccess(`Accepted ${pendingName || "member"} request.`);
      setLoadingApprove(false);
      mutate();
      refetchMyClub?.();
    } catch (error) {
      console.log("err getWaitlist", error);
      toastError(error?.message);
      setLoadingApprove(false);
    }
  };

  const onReject = async (
    clubId: string | number | undefined,
    pendingId: string | number | undefined,
    pendingName?: string | undefined,
  ) => {
    if (!pendingId || !clubId) return;
    setLoadingReject(true);
    console.log("onReject", clubId, pendingId);
    try {
      await post(`/clubs/${clubId}/approve/${pendingId}`, {
        needAuth: true,
        body: {
          isApproved: false,
        },
      });
      toastSuccess(`Rejected ${pendingName || "member"} request.`);
      setLoadingReject(false);
      mutate();
      refetchMyClub?.();
    } catch (error) {
      console.log("err getWaitlist", error);
      toastError(error?.message);
      setLoadingReject(false);
    }
  };

  return {
    onApprove,
    loadingApprove,
    onReject,
    loadingReject,
    loadingData,
    waitList,
  };
};

export default useWaitlist;
