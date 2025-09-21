import ReactApexChart from "react-apexcharts";
import { Link } from "react-router";
import { SidebarRoutes } from "../../routes";
import { Divider } from "@heroui/react";
import { options, value } from "../../staticData";

export default function ReportSummary() {
  return (
    <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-transparent flex flex-col">
      <div className="pb-3">
        <h1 className="text-lg  font-semibold text-foreground">
          Recent Test Performance
        </h1>
      </div>
      {/* test summary */}
      <div className="py-2 space-y-2">
        <div className="relative flex items-center justify-center">
          <ReactApexChart
            options={options}
            series={[value]}
            type="radialBar"
            height={200}
            width={200}
          />
        </div>
        <div className="flex justify-center items-center flex-col space-y-2">
          <h3 className="text-base font-semibold text-kidemia-grey">
            Test Performance
          </h3>
          <Link
            to={SidebarRoutes.performance}
            className="text-sm text-kidemia-grey hover:underline hover:text-kidemia-primary"
          >
            view history
          </Link>
        </div>
      </div>

      <Divider className="my-5 px-4" />
      {/* exam summary */}
      <div className="py-2 space-y-2">
        <div className="relative flex items-center justify-center">
          <ReactApexChart
            options={options}
            series={[value]}
            type="radialBar"
            height={200}
            width={200}
          />
        </div>
        <div className="flex justify-center items-center flex-col space-y-2">
          <h3 className="text-base font-semibold text-kidemia-grey">
            Exam Performance
          </h3>
          <Link
            to={SidebarRoutes.performance}
            className="text-sm text-kidemia-grey hover:underline hover:text-kidemia-primary"
          >
            view history
          </Link>
        </div>
      </div>
    </div>
  );
}
