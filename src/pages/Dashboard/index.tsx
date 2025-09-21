import { useNavigate } from "react-router";
import { Button } from "@heroui/react";
import AnalyticsChart from "../../components/Dashboard/AnalyticsChart";
import ReportSummary from "../../components/Dashboard/ReportSummary";
import StatCard from "../../components/Dashboard/StatCard";
import AssesstmentHistory from "../../components/Dashboard/AssesstmentHistory";
import { LuBookOpenCheck, LuNotebookPen } from "react-icons/lu";
import { PiExamFill } from "react-icons/pi";
import { FaSpellCheck } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { categoriesData, dataSeries } from "../../staticData";
import { TestRoutes } from "../../routes";

export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-end items-center">
          <div className="flex  items-center space-x-3">
            <Button
              className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
              variant="faded"
              size="md"
              radius="sm"
              type="button"
              onPress={() => navigate(TestRoutes.takeTest)}
            >
              Take a Test
            </Button>

            <Button
              className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
              size="md"
              radius="sm"
              type="button"
            >
              Take an Exam
            </Button>
          </div>
        </div>
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5 gap-5 lg:gap-4">
            <StatCard
              icon={LuNotebookPen}
              title="No. of Tests Attempted"
              figure="70"
            />
            <StatCard
              icon={LuBookOpenCheck}
              title="Correct Test Questions Answered"
              figure="40"
            />
            <StatCard
              icon={PiExamFill}
              title="No. of Exams Attempted"
              figure="50"
            />
            <StatCard
              icon={FaSpellCheck}
              title="Correct Exam Questions Answered"
              figure="30"
            />
            <StatCard
              icon={MdTimer}
              title="No. of Tests Attempted"
              figure="1.00"
              sub="min per question"
            />
          </div>

          <div>
            <AnalyticsChart
              categories={categoriesData}
              dataSeries={dataSeries}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-5 lg:gap-3">
            <div className="lg:col-span-3 lg:w-[70%]">
              <AssesstmentHistory />
            </div>

            <div className="lg:w-[30%]">
              <ReportSummary />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
