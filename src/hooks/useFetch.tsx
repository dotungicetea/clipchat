"use client";

import { getDefaultHeaders } from "@/request";
import { URLS } from "@constants/index";
import { clearAccountToken } from "@utils/index";
import useSWR, { KeyedMutator } from "swr";

type useFetchReturnType<T> = {
  loading: boolean;
  error: string;
  data: T | undefined;
  mutate: KeyedMutator<any>;
};
export const fetcher = async (url: string) => {
  const headers = getDefaultHeaders();

  // const response = await fetch(`${API_BASE_URL}${url}`, {
  const response = await fetch(`/api/api${url}`, {
    headers,
  });

  if (!response.ok) {
    // Token expired
    if (response.status === 401) {
      const res = await response.json();
      if (res?.message === "Unauthorized") {
        clearAccountToken();
        window.location.href = URLS.LOGIN;
        return;
      }
    }

    throw new Error(`${response.status} - ${response.statusText}`).message;
  }
  return await response.json();
};

const useFetch = (
  uriProps?: string | undefined,
  shouldFetch = true,
  disableAutoRefetch = false,
): useFetchReturnType<any> => {
  const { data, error, mutate, isLoading } = useSWR(
    shouldFetch ? uriProps : null,
    fetcher,
    disableAutoRefetch
      ? {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }
      : {},
  );

  return {
    loading: isLoading,
    data: data?.data,
    error,
    mutate,
  };
};

export default useFetch;
