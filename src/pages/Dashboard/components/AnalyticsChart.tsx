import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface SeriesData {
  name: string;
  data: number[];
}

interface Props {
  testCategories: string[];
  testDataSeries: SeriesData[];
  examCategories: string[];
  examDataSeries: SeriesData[];
}

export default function AnalyticsChart({
  testCategories,
  testDataSeries,
  examCategories,
  examDataSeries,
}: Props) {
  // Create chart options for tests
  const testChartOptions: ApexOptions = useMemo(() => {
    const rawData = testDataSeries.flatMap((item) => item.data);
    const computedYMin = rawData.length ? Math.floor(Math.min(...rawData)) : 0;
    const computedYMax = rawData.length ? Math.ceil(Math.max(...rawData)) + 1 : 100;

    return {
      colors: ["#16732D", "#F28729", "#BF4C20", "#2A3740"],
      chart: {
        height: 350,
        type: "bar",
        foreColor: "#2A3740",
        background: "transparent",
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "60%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: testCategories,
        labels: {
          style: {
            colors: "#2A3740",
            fontSize: "12px",
          },
          rotate: -45,
          rotateAlways: testCategories.length > 6,
        },
      },
      yaxis: {
        tickAmount: Math.max(2, Math.min(10, computedYMax - computedYMin)),
        min: computedYMin,
        max: computedYMax,
        labels: {
          formatter: (value: number) => Math.round(value).toString(),
          style: {
            colors: "#2A3740",
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        offsetY: 20,
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }, [testCategories, testDataSeries]);

  // Create chart options for exams
  const examChartOptions: ApexOptions = useMemo(() => {
    const rawData = examDataSeries.flatMap((item) => item.data);
    const computedYMin = rawData.length ? Math.floor(Math.min(...rawData)) : 0;
    const computedYMax = rawData.length ? Math.ceil(Math.max(...rawData)) + 1 : 100;

    return {
      colors: ["#BF4C20", "#F28729", "#16732D", "#2A3740"],
      chart: {
        height: 350,
        type: "bar",
        foreColor: "#2A3740",
        background: "transparent",
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "60%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: examCategories,
        labels: {
          style: {
            colors: "#2A3740",
            fontSize: "12px",
          },
          rotate: -45,
          rotateAlways: examCategories.length > 6,
        },
      },
      yaxis: {
        tickAmount: Math.max(2, Math.min(10, computedYMax - computedYMin)),
        min: computedYMin,
        max: computedYMax,
        labels: {
          formatter: (value: number) => Math.round(value).toString(),
          style: {
            colors: "#2A3740",
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        offsetY: 20,
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }, [examCategories, examDataSeries]);

  const hasTestData = testDataSeries.length > 0 && testDataSeries.some(s => s.data.length > 0);
  const hasExamData = examDataSeries.length > 0 && examDataSeries.some(s => s.data.length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Test Chart */}
      <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-kidemia-white">
        <div className="pb-3 flex justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Recent Test Performance
          </h1>
        </div>
        <div className="overflow-hidden">
          {hasTestData ? (
            <ReactApexChart
              options={testChartOptions}
              series={testDataSeries}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">No test data available</p>
                <p className="text-sm mt-2">Start taking practice tests to see your performance</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exam Chart */}
      <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-kidemia-white">
        <div className="pb-3 flex justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Recent Exam Performance
          </h1>
        </div>
        <div className="overflow-hidden">
          {hasExamData ? (
            <ReactApexChart
              options={examChartOptions}
              series={examDataSeries}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">No exam data available</p>
                <p className="text-sm mt-2">Take your first exam to see your performance</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}