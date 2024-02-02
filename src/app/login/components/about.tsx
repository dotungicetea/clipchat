"use client";

import Loading from "@components/PageLoading";
import iconCat from "@images/icon-cat.svg";
import iconHow from "@images/icon-how.svg";
import iconPrivate from "@images/icon-private.svg";
import iconRoyalty from "@images/icon-royalty.svg";
import iconTwitter from "@images/icon-twitter.svg";
import Image from "next/image";
import { useTransition } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useLogin from "../hooks/useLogin";

const abouts = [
  {
    title: `Welcome to Coffee Club \nA Marketplace for your friend group`,
    desc: "Coffee Club lets you buy keys to join private telegram groups. If you no longer want to be part of the Club, you can sell your keys any time.",
    icon: iconCat,
  },
  {
    title: "How it works",
    desc: "Everybody joins Coffee Club by signing in with X. Upon signing in with X, you will get your own private Club on Telegram. Members can buy keys and will be direct messaged a link to join the private Telegram group via the Coffee Club bot. If they sell their keys they will automatically be removed from the Telegram group.",
    icon: iconHow,
  },
  {
    title: "Invite Only Private Clubs",
    desc: "Buying a key does not mean you'll be admitted into the Club; owners must accept waitlisted members for them to be admitted. Buying multiple keys might better your chances to prove your loyalty and be accepted.",
    icon: iconPrivate,
  },
  {
    title: "Royalties",
    desc: "6% of all buy and sell fees of a key goes to the Club owner, and 4% to the Coffee Club platform.",
    icon: iconRoyalty,
  },
] as const;

const About = () => {
  const { signIn, loading } = useLogin();
  const [isPending] = useTransition();

  return (
    <>
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="flex h-full w-full flex-1 flex-col px-[15px] text-12/16 text-white"
      >
        {abouts.map((item, index: number) => (
          <SwiperSlide key={index}>
            <Image alt="" src={item.icon} height={40} className="mx-auto w-auto" />
            <p className="labelText mt-[15px] h-[65px] whitespace-pre-line leading-[15px]">
              {item.title}
            </p>
            <p className="normalText">{item.desc}</p>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="group-btn">
        <button className="btn btnGray mt-auto" onClick={signIn} disabled={loading}>
          <span className="mr-1.5">Sign in with</span>
          <Image alt="" src={iconTwitter} width={12} className="h-auto" />
        </button>
        <p className="textBlur mt-5 px-5 text-10/14">
          Don’t worry there are no intrusive permissions required; only permissions need granted are
          profile and following list.
        </p>
      </div>

      <Loading show={loading || isPending} />
    </>
  );
};

export default About;
