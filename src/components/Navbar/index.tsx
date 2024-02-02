"use client";

import { useAppContext } from "@/providers/app.provider";
import { TELEGRAM_BOT_URL, URLS } from "@constants/index";
import iconFavoriteActived from "@images/icon-favorite-actived.svg";
import iconFavorite from "@images/icon-favorite.svg";
import iconProfileActived from "@images/icon-profile-actived.svg";
import iconProfile from "@images/icon-profile.svg";
import iconSearchActived from "@images/icon-search-actived.svg";
import iconSearch from "@images/icon-search.svg";
import iconTelegram from "@images/icon-telegram.svg";
import iconWebActived from "@images/icon-web-actived.svg";
import iconWeb from "@images/icon-web.svg";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

const hiddenRoutes = ["/", URLS.LOGIN, URLS.BRIDGE];

const Navbar = () => {
  const pathname = usePathname();
  const { myClub } = useAppContext();

  const isCurrentRoute = useCallback(
    (route: (typeof URLS)[keyof typeof URLS]) => {
      return route === pathname;
    },
    [pathname],
  );

  const openTelegram = () => {
    window.open(TELEGRAM_BOT_URL);
  };

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-1/2 z-[4] h-20 w-full max-w-md -translate-x-1/2 bg-black px-7 pt-3",
        hiddenRoutes.includes(pathname) ? "hidden" : "flex",
      )}
    >
      <nav className="flex h-fit w-full items-center justify-between">
        <Link href={URLS.EXPLORE} scroll={false}>
          <Image
            src={isCurrentRoute(URLS.EXPLORE) ? iconWebActived : iconWeb}
            alt=""
            width={26}
            className="h-auto"
            loading="lazy"
          />
        </Link>
        <Link href={URLS.SEARCH} scroll={false}>
          <Image
            src={isCurrentRoute(URLS.SEARCH) ? iconSearchActived : iconSearch}
            alt=""
            width={24}
            className="h-auto"
            loading="lazy"
          />
        </Link>
        <div className="cursor-pointer" onClick={openTelegram}>
          <Image src={iconTelegram} alt="" priority width={32} className="h-auto" />
        </div>
        <Link href={URLS.ACTIVITY} scroll={false}>
          <Image
            src={isCurrentRoute(URLS.ACTIVITY) ? iconFavoriteActived : iconFavorite}
            alt=""
            width={24}
            className="h-auto"
            loading="lazy"
          />
        </Link>
        <Link href={URLS.PROFILE} scroll={false}>
          <div className="relative">
            <Image
              src={isCurrentRoute(URLS.PROFILE) ? iconProfileActived : iconProfile}
              alt=""
              width={22}
              className="h-auto"
              loading="lazy"
            />
            {myClub?.pending_members_count > 0 && (
              <div className="absolute -right-1.5 -top-1.5 h-[7px] w-[7px] rounded-full bg-[#00BBF9]"></div>
            )}
          </div>
        </Link>
        <Link href={`${URLS.EXPLORE}/:id`} className="hidden"></Link>
      </nav>
    </div>
  );
};

export default Navbar;
