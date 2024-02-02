"use client";

import { post } from "@/request";
import { toastError, toastSuccess } from "@components/CustomToast";
import { useCallback, useEffect, useState } from "react";
import useFetch from "./useFetch";
import useSearchInput from "./useSearchInput";

const useMembers = (clubId?: string | number) => {
  const { inputSearch, searchValue, handleSearch, handleCancel } = useSearchInput();

  const [pageSize] = useState<number>(10);
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [loadingBlock, setLoadingBlock] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [stopLoadMore, setStopLoadMore] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<any>();

  const {
    data: dataActiveMembers,
    loading: loadingData,
    mutate,
  } = useFetch(
    `/clubs/${clubId}/members?search=${searchValue}&page=1&pageSize=${pageNumber * pageSize}`,
    !!clubId,
  );

  useEffect(() => {
    if (!dataActiveMembers) return;
    setMetaData(dataActiveMembers?.meta);
    const nextData = dataActiveMembers?.data || [];
    const { current_page, last_page } = dataActiveMembers?.meta || {};
    if (current_page >= last_page) {
      setStopLoadMore(true);
    }
    setActiveMembers(nextData);
  }, [dataActiveMembers]);

  const handleLoadMore = useCallback(() => {
    if (stopLoadMore) return;
    setPageNumber((prev) => prev + 1);
  }, [stopLoadMore]);

  const updateMember = useCallback(
    async (member: any | undefined, action: "block" | "unblock") => {
      if (!member?.id) return;
      setLoadingBlock(true);
      try {
        const res = await post(`/clubs/${clubId}/members/${member?.id}/edit-banned`, {
          needAuth: true,
          body: {
            isBanned: action === "block",
          },
        });
        setLoadingBlock(false);
        mutate();
        toastSuccess(
          `${action === "block" ? "Blocked" : "Unblocked"} ${member?.name || "member"}.`,
        );
      } catch (error) {
        console.log("err blockMember", error);
        toastError(error?.message);
        setLoadingBlock(false);
      }
    },
    [clubId, mutate],
  );

  return {
    activeMembers,
    metaData,
    pageNumber,
    loadingData,
    updateMember,
    loadingBlock,
    inputSearch,
    handleSearch,
    handleCancel,
    stopLoadMore,
    handleLoadMore,
  };
};

export default useMembers;
