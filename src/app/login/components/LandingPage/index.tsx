"use client";

import imgCatToast from "@images/LandingPage/Cat-Toast-p-500.png";
import imgBuyMembership from "@images/LandingPage/Club---Buy-3-Memberships-p-1080.png";
import imgExplore from "@images/LandingPage/Explore---For-You-p-1080.png";
import iconAccept from "@images/LandingPage/accept.svg";
import iconBot from "@images/LandingPage/bot.svg";
import iconChart from "@images/LandingPage/chart.svg";
import iconCoffee from "@images/LandingPage/coffee.svg";
import iconDoc from "@images/LandingPage/doc.svg";
import iconFaq from "@images/LandingPage/faq.svg";
import iconHome from "@images/LandingPage/home.svg";
import iconMedium from "@images/LandingPage/medium.svg";
import iconTelegram from "@images/LandingPage/telegram.svg";
import iconTwitter from "@images/LandingPage/x-twitter.svg";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import "./landing.css";
import useMousePosition from "./useMousePosition";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const LandingPage = ({ isIOSDevice }: { isIOSDevice: boolean }) => {
  const mousePosition = useMousePosition();
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const transform = useMemo(() => {
    const [translateX, translateY] = [200, 110];
    const { x, y } = mousePosition;
    // image posotion = {1260, 240}
    const xDiff = x - 1260;
    const yDiff = y - 240;

    return prefersReducedMotion
      ? { cat: "", buy: "", clubs: "" }
      : {
          cat: `translate3d(${translateX + xDiff / 20}px, ${
            translateY + yDiff / 20
          }px, 200px) rotateZ(0deg) skew(0, 0)`,
          buy: `translate3d(${100 + xDiff / 60}px, ${200 + yDiff / 70}px, 100px) rotateX(${
            xDiff / 300
          }deg) rotateY(${-yDiff / 300}deg) skew(-10deg)`,
          clubs: `translate3d(${175 - xDiff / 60}px, ${-yDiff / 70}px, -50px)  rotateX(${
            xDiff / 300
          }deg) rotateY(${-yDiff / 300}deg) skew(-10deg)`,
        };
  }, [mousePosition, prefersReducedMotion]);

  const handleScrollDown = () => {
    const element = document.getElementById("element_x");

    element.scrollTo({
      top: (ref?.current?.offsetTop ?? window.innerHeight) - 50,
      behavior: "smooth",
    });
  };

  return (
    <div
      id="element_x"
      className={clsx(
        "h-fill fixed left-0 top-0 max-h-screen w-screen overflow-y-auto overflow-x-hidden",
        "sm:overflow-hidden",
      )}
    >
      <div className={"bg-gradient relative mx-auto flex w-screen items-center justify-center"}>
        <div className="w-layout-blockcontainer banner w-container">
          <div className="text-block bold">Mobile Only</div>
          <div className="text-block">
            In order to use the Coffee Club app please visit this website on your mobile device
          </div>
        </div>

        <section className="mobile-banner">
          <div className="mobile-wrapper">
            <Image src={iconHome} loading="lazy" alt="Home icon" />
            <h5 className="heading">Add to Home Screen</h5>
            <p>
              To install the app, you need to add this website to your home screen.
              <br />
              <br />
              {isIOSDevice
                ? "In your Safari browser menu, tap the Share icon and choose Add to Home Screen in the options. Then open Coffee Club app from your home screen."
                : "In your Chrome browser menu, tap the More button and choose Install App in the options. Then open Coffee Club app from your home screen."}
            </p>
            <div
              className="button margin-top w-inline-block cursor-pointer"
              onClick={handleScrollDown}
            >
              <Image src={iconCoffee} loading="lazy" alt="Coffee Club logo" />
              <div>Learn More</div>
            </div>
          </div>

          <Image
            src={imgCatToast}
            loading="lazy"
            width={200}
            alt=""
            className="absolute -bottom-20 -right-0 h-auto sm:hidden"
          />
        </section>

        <div
          ref={ref}
          className="z-[2] mx-auto flex h-full max-h-[1024px] w-full max-w-[1440px] justify-center px-[25px] sm:py-[10vh]"
        >
          <div className="banner-stack wf-layout-layout main-content">
            <div className="w-layout-cell">
              <div className="logo-div">
                <Image
                  src={iconCoffee}
                  loading="lazy"
                  alt="Coffee Club logo"
                  className="logo-image"
                />
                <div className="logo">Coffee Club</div>
              </div>
              <div className="header-div">
                <h1>Trade Tokens for Exclusive Friend Clubs</h1>
                <p>
                  What would be the liquid valuation of your first-degree friend group? Coffee Club
                  is a web3 marketplace to trade key tokens that lets you apply to be part of
                  private groups on Telegram.
                </p>
              </div>
              <div className="w-layout-layout banner-list-stack wf-layout-layout">
                <div className="w-layout-cell list-cell">
                  <Image src={iconChart} loading="lazy" alt="Chart icon" />
                  <div className="list-text">
                    Create and trade key tokens to join private groups on Telegram
                  </div>
                </div>
                <div className="w-layout-cell list-cell">
                  <Image src={iconBot} loading="lazy" alt="Bot icon" />
                  <div className="list-text">
                    Full Integration with Coffee Club Telegram bot to manage private clubs
                  </div>
                </div>
                <div className="w-layout-cell list-cell">
                  <Image src={iconAccept} loading="lazy" alt="Accept icon" />
                  <div className="list-text">
                    Creators must ACCEPT members into their club for privacy and exclusivity
                  </div>
                </div>
              </div>
              <div className={"footer-div !gap-x-0 sm:gap-x-4"}>
                <Link href="http://wp.coffeeclubapp.com" className="button w-inline-block">
                  <Image src={iconDoc} loading="lazy" alt="White Paper icon" />
                  <div>White Paper</div>
                </Link>
                <Link
                  href="http://x.com/coffeeclub_app"
                  target="_blank"
                  className="social-link w-inline-block"
                >
                  <Image src={iconTwitter} loading="lazy" alt="X (Formerly Twitter) icon" />
                </Link>
                <Link href="https://t.me/CoffeeClub_App" className="social-link w-inline-block">
                  <Image src={iconTelegram} loading="lazy" alt="Telegram icon" />
                </Link>
                <Link
                  href="https://coffeeclubapp.medium.com"
                  target="_blank"
                  className="social-link w-inline-block"
                >
                  <Image src={iconMedium} loading="lazy" alt="Medium icon" />
                </Link>
                <Link href="http://faq.coffeeclubapp.com" className="social-link w-inline-block">
                  <Image src={iconFaq} loading="lazy" alt="Frequently asked questions" />
                </Link>
              </div>
            </div>

            <div className="w-layout-cell">
              <div className="_3d-wrapper">
                <Image
                  src={imgCatToast}
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 375px"
                  alt=""
                  className="cats"
                  style={{
                    transform: transform.cat,
                  }}
                />
                <div
                  className="member-club"
                  style={{
                    transform: transform.buy,
                  }}
                >
                  <Image
                    src={imgBuyMembership}
                    loading="lazy"
                    sizes="(max-width: 479px) 100vw, (max-width: 767px) 346.9798278808594px, (max-width: 991px) 491.4712219238281px, 491.47119140625px"
                    alt=""
                    className="screenshot"
                  />
                  <div className="card-blur" />
                </div>
                <div
                  className="explore"
                  style={{
                    transform: transform.clubs,
                  }}
                >
                  <Image
                    src={imgExplore}
                    loading="lazy"
                    sizes="(max-width: 479px) 100vw, (max-width: 767px) 346.9798583984375px, (max-width: 991px) 63vw, 49vw"
                    alt=""
                    className="screenshot"
                  />
                  <div className="card-blur" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg"></div>
      </div>
      <div className="gradient"></div>
    </div>
  );
};

export default LandingPage;
