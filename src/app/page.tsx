"use client";

import { useRouter } from "next/navigation";
import { URLS } from "@constants/index";
import { useEffect } from "react";

export default function Home() {
  const { push } = useRouter();

  useEffect(() => {
    push(URLS.BRIDGE);
  }, [push]);
  return <></>;
}
