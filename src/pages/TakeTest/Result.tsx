import { useNavigate } from "react-router";
import ReactApexChart from "react-apexcharts";
import { Button } from "@heroui/react";
import { options, value } from "../../staticData";
import { SidebarRoutes } from "../../routes";

export default function ResultPage() {
  const navigate = useNavigate();
  return (
    <section className="py-4 space-y-12 md:px-12 w-full max-w-xl">
      <div className="relative flex items-center justify-center">
        <ReactApexChart
          options={options}
          series={[value]}
          type="radialBar"
          height={200}
          width={200}
        />
      </div>

      <div>
        <div className="space-y-3">
          <h2 className="text-xl text-kidemia-black font-semibold text-center">
            You got 5/20
          </h2>

          <div className="flex justify-around items-center gap-3">
            <p className="text-md font-semibold text-kidemia-black">Remark:</p>
            <p className="text-base text-kidemia-grey font-medium">Poor</p>
          </div>

          <div className="flex justify-around items-center gap-3">
            <p className="text-md font-semibold text-kidemia-black">Comment:</p>
            <p className="text-base text-kidemia-grey font-medium">
              You can always do better
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 py-6">
        <Button
          className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
          variant="faded"
          size="md"
          radius="sm"
          type="button"
        >
          View Corrections
        </Button>

        <Button
          className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
          size="md"
          radius="sm"
          type="button"
          onPress={() => navigate(SidebarRoutes.dashboard)}
        >
          Dashboard
        </Button>
      </div>
    </section>
  );
}
