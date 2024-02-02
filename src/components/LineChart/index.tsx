"use client";

import { formatCurrency, formatDateTime } from "@utils/index";
import { ColorType, MouseEventParams, Time, createChart } from "lightweight-charts";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./chart.module.scss";
import clsx from "clsx";
// import { TChartVolume } from "@/app/profile/hooks/useChart";

type TLineChart = {
  height?: number;
  data: any[];
  loading: boolean;
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  isPortfolio?: boolean;
  chartVolume?: any;
  loadingVolume?: boolean;
};

export const LineChart = (props: TLineChart) => {
  const {
    data,
    height = 200,
    loading,
    selectedOption,
    setSelectedOption,
    isPortfolio,
    chartVolume,
    loadingVolume,
  } = props;

  const chartContainerRef = useRef<any>(null);
  const [valueDisplay, setValueDisplay] = useState<{
    price: number | string;
    dateTime: string;
  }>();

  useEffect(() => {
    if (!data || data.length === 0 || !chartContainerRef?.current) return;
    console.log("chart data", data);
    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: { type: ColorType.Solid, color: "black" },
        textColor: "white",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
      autoSize: false,
      handleScale: {
        mouseWheel: false,
      },
      trackingMode: {
        exitMode: 0,
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        vertLine: {
          width: 4,
          color: "#00F5D440",
          style: 0,
          labelVisible: false,
        },
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        mode: 1,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.5,
          bottom: 0,
        },
      },
      overlayPriceScales: {
        mode: 1,
        ticksVisible: false,
      },
      width: chartContainerRef?.current?.clientWidth,
      height,
    });
    chart.timeScale().fitContent();

    const areaSeries = chart.addAreaSeries({
      lineColor: "#00F5D4",
      topColor: "#00F5D4",
      bottomColor: "black",
      priceScaleId: "right",
      priceLineStyle: 0,
      priceLineVisible: false,
      // lastValueVisible: false,
      // lastPriceAnimation: 1,
      lineType: 2,
      lineWidth: 4,
      crosshairMarkerBackgroundColor: "black",
      crosshairMarkerBorderWidth: 4,
      crosshairMarkerBorderColor: "#00F5D4",
    });
    areaSeries.setData(data);

    const lastValue = [...data].pop();
    setValueDisplay({
      dateTime: formatDateTime(lastValue?.time),
      price: lastValue?.value,
    });

    const handleClickPoint = (param: MouseEventParams<Time>) => {
      if (param.time) {
        const data: any = param.seriesData.get(areaSeries);
        const price = data?.value;
        const dateTime = formatDateTime(data?.time);
        console.log("chart click", dateTime, price);
        setValueDisplay({
          dateTime,
          price,
        });
      }
    };

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    window.addEventListener("resize", handleResize);
    chart.subscribeClick(handleClickPoint);

    return () => {
      console.log("remove chart");
      window.removeEventListener("resize", handleResize);
      chart.unsubscribeClick(handleClickPoint);
      chart.removeSeries(areaSeries);
      chart.remove();
    };
  }, [data, height, chartContainerRef]);

  if (loading)
    return (
      <div className="flex w-full items-center justify-center" style={{ height: height }}>
        Loading Chart ...
      </div>
    );
  if (!loading && data?.length === 0) return <></>;

  return (
    <div className="flex w-full flex-col">
      <div ref={chartContainerRef} className={styles.customChart}>
        <div className="absolute left-1/2 top-1 z-[3] flex -translate-x-1/2 flex-col text-center">
          <p className="text-20/28 font-bold">{`${valueDisplay?.price || 0} ETH`}</p>
          <p className="uppercase">{valueDisplay?.dateTime}</p>
        </div>
      </div>

      <div className="mx-auto mt-2 grid w-fit grid-cols-5 gap-4">
        {options.map((item, index: number) => (
          <div
            className={clsx(
              "normalText flex w-fit cursor-pointer items-center justify-center px-[5px] py-[2px]",
              selectedOption === item ? "bg-[#262626]" : "",
            )}
            onClick={() => setSelectedOption(item)}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>

      {isPortfolio ? null : (
        <div className="labelText mt-5 flex items-center justify-between px-[25px]">
          <div className="flex">
            <span className="textBlur">24H Volume</span>
            <span className="ml-2.5">
              {loadingVolume
                ? "..."
                : `${formatCurrency(chartVolume?.volume24h || "0", 6)} ${false || "ETH"}`}
            </span>
          </div>
          <div className="flex">
            <span className="textBlur">Total Volume</span>
            <span className="ml-2.5">
              {loadingVolume
                ? "..."
                : `${formatCurrency(chartVolume?.totalVolume || "0", 6)} ${false || "ETH"}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const options = ["1D", "1W", "1M", "1Y", "ALL"] as const;
