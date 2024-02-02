"use client";

import { Address } from "viem";
import { base, baseSepolia, sepolia } from "viem/chains";
import { mainnet } from "wagmi";

export const isProd = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
export const currentChain = isProd ? base : baseSepolia;

export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API + "api";
export const TELEGRAM_BOT_URL = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL;
export const COFFEE_CONTRACT = process.env.NEXT_PUBLIC_COFFEE_CONTRACT as Address;

export const ETHERSCAN_URL = currentChain.blockExplorers.default.url;
export const NETWORK_ID = currentChain.id;

export const l1Chain = isProd ? mainnet : sepolia;
export const L1_ETHERSCAN_URL = l1Chain.blockExplorers.default.url;
export const L1_NETWORK_ID = l1Chain.id;

export const URLS = {
  HOME: "/",
  LOGIN: "/login",
  ACTIVITY: "/activity",
  CLUB: "/club",
  EXPLORE: "/explore",
  PROFILE: "/profile",
  SEARCH: "/search",
  BRIDGE: "/deposit",
} as const;
