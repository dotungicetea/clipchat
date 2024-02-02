"use client";

import { ETHERSCAN_URL } from "@constants/index";
import moment, { MomentInput } from "moment";
import { isMobileSafari, isSafari } from "react-device-detect";
import { Address } from "viem";
import PullToRefresh from "pulltorefreshjs";

const USER_DATA_KEY = "user";
const FIREBASE_TOKEN_KEY = "firebase.token";

export const formatCurrency = (n: any, maxLengthOfDecimal = 5) => {
  if (Number.isNaN(n)) return "0";

  const newNumber = Number(n);
  const lengthOfDecimal = Math.floor(newNumber) !== newNumber ? maxLengthOfDecimal : 0;

  const re = `\\d(?=(\\d{3})+${lengthOfDecimal ? "\\." : "$"})`;
  return newNumber.toFixed(Math.max(0, ~~lengthOfDecimal)).replace(new RegExp(re, "g"), "$&,");
};

export const displayWalletAddress = (address: string | undefined, digits = 5) => {
  if (!address) return "N/A";
  return `${address.substring(0, digits)}...${address.substring(
    address.length - 4,
    address.length,
  )}`;
};

export const formatDateTime = (dateTime: MomentInput) => {
  if (!dateTime) return "";
  return moment(dateTime).format("MMM DD, YYYY");
};

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getTransactionLink = (transactionHash: string | undefined) => {
  if (!transactionHash) return "";
  return `${ETHERSCAN_URL}/tx/${transactionHash}`;
};

type SavedUserData = {
  token: string;
  wallet: Address;
  user: any;
};

export const saveUserData = (walletAddr: Address, token: string, user: any) => {
  if (!walletAddr) return;

  const data: SavedUserData = {
    token,
    wallet: walletAddr,
    user,
  };

  return localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
};

export const getSessionId = (): boolean => {
  if (typeof window === "undefined") return;
  const rawData = localStorage.getItem("openlogin_store");
  if (!rawData) return;

  try {
    return JSON.parse(rawData)?.sessionId;
  } catch {
    return;
  }
};
export const getUserData = () => {
  const rawData = localStorage.getItem(USER_DATA_KEY);
  if (!rawData) return;

  try {
    return JSON.parse(rawData);
  } catch {}
};

export const clearAccountToken = () => {
  return localStorage.removeItem(USER_DATA_KEY);
};

export const getFcmToken = () => {
  return localStorage.getItem(FIREBASE_TOKEN_KEY);
};
export const saveFcmToken = (token: string) => {
  if (!token) return;

  return localStorage.setItem(FIREBASE_TOKEN_KEY, token);
};
export const clearFcmToken = () => {
  return localStorage.removeItem(FIREBASE_TOKEN_KEY);
};

export const getTimeAgo = (timestamp: number | string) => {
  if (!timestamp) return "unknown";
  const currentTime: number = Math.floor(Date.now() / 1000);
  const timeDifference: number = currentTime - +timestamp;

  // Define time intervals in seconds
  const intervals: { label: string; seconds: number }[] = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(timeDifference / interval.seconds);

    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }

  return "Just now";
};

export const getSuffix = (amount: number | undefined) => {
  if (!amount) return "";
  return amount > 1 ? "s" : "";
};

export const initPullToRefresh = () => {
  const isIOSDevice = isSafari || isMobileSafari;
  const isRunningAsPWA =
    (window.navigator as any)?.standalone ||
    window.matchMedia("(display-mode: standalone)").matches;

  if (!isRunningAsPWA || !isIOSDevice) return;
  PullToRefresh.init({
    onRefresh() {
      window.location.reload();
    },
  });
};
