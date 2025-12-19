import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router";
import { SidebarRoutes } from "../../../routes";
import { Divider } from "@heroui/react";
import type { ApexOptions } from "apexcharts";

interface Props {
  testPerformance: number;
  examPerformance: number;
}

export default function ReportSummary({ testPerformance, examPerformance }: Props) {
  const createRadialOptions = (value: number): ApexOptions =>
    useMemo(
      () => ({
        chart: {
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              margin: 0,
              size: "70%",
              background: "#fff",
            },
            track: {
              background: "#e7e7e7",
              strokeWidth: "97%",
              margin: 5,
            },
            dataLabels: {
              show: true,
              name: {
                show: false,
              },
              value: {
                formatter: (val: number) => `${val}%`,
                color: "#111",
                fontSize: "24px",
                fontWeight: "bold",
                show: true,
                offsetY: 10,
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: value >= 75 ? ["#16732D"] : value >= 50 ? ["#F28729"] : ["#BF4C20"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: ["Progress"],
      }),
      [value]
    );

  const testOptions = createRadialOptions(testPerformance);
  const examOptions = createRadialOptions(examPerformance);

  return (
    <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-transparent flex flex-col">
      <div className="pb-3">
        <h1 className="text-lg font-semibold text-foreground">Performance Summary</h1>
      </div>

      {/* Test Summary */}
      <div className="py-2 space-y-2">
        <div className="relative flex items-center justify-center">
          {testPerformance > 0 ? (
            <ReactApexChart
              options={testOptions}
              series={[testPerformance]}
              type="radialBar"
              height={200}
              width={200}
            />
          ) : (
            <div className="flex items-center justify-center h-[200px] w-[200px]">
              <div className="text-center text-gray-400">
                <p className="text-sm">No data</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center flex-col space-y-2">
          <h3 className="text-base font-semibold text-kidemia-grey">Test Performance</h3>
          <Link
            to={SidebarRoutes.performance}
            className="text-sm text-kidemia-grey hover:underline hover:text-kidemia-primary transition-colors"
          >
            view history
          </Link>
        </div>
      </div>

      <Divider className="my-5 px-4" />

      {/* Exam Summary */}
      <div className="py-2 space-y-2">
        <div className="relative flex items-center justify-center">
          {examPerformance > 0 ? (
            <ReactApexChart
              options={examOptions}
              series={[examPerformance]}
              type="radialBar"
              height={200}
              width={200}
            />
          ) : (
            <div className="flex items-center justify-center h-[200px] w-[200px]">
              <div className="text-center text-gray-400">
                <p className="text-sm">No data</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center flex-col space-y-2">
          <h3 className="text-base font-semibold text-kidemia-grey">Exam Performance</h3>
          <Link
            to={SidebarRoutes.performance}
            className="text-sm text-kidemia-grey hover:underline hover:text-kidemia-primary transition-colors"
          >
            view history
          </Link>
        </div>
      </div>
    </div>
  );
}