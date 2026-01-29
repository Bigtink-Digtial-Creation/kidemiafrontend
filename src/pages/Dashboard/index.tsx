import { useNavigate } from "react-router";
import { Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuBookOpenCheck, LuNotebookPen } from "react-icons/lu";
import { PiExamFill } from "react-icons/pi";
import { FaSpellCheck } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import AnalyticsChart from "./components/AnalyticsChart";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import StatCard from "./components/StatCard";
import ReportSummary from "./components/ReportSummary";
import AssesstmentHistory from "./components/AssesstmentHistory";
import { SidebarRoutes, TestRoutes, WardRoutes } from "../../routes";
import { AiFillTrophy } from "react-icons/ai";
import { FiEdit3, FiZap } from "react-icons/fi";


export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: [QueryKeys.analytics],
    queryFn: async () => {
      return ApiSDK.LeaderboardService.getDashboardStatApiV1LeaderboardMeStatDashboardGet();
    },
  });

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back!</h1>
          <p className="text-slate-500">Ready to sharpen your skills today?</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            className="bg-white hover:bg-orange-50 border-2 border-orange-100 font-bold text-orange-600 shadow-sm transition-all hover:scale-105"
            variant="flat"
            size="lg"
            radius="full"
            startContent={<AiFillTrophy className="text-xl" />}
            onPress={() => navigate(WardRoutes.challenges)}
          >
            Challenges
          </Button>

          <Button
            className="bg-white hover:bg-blue-50 border-2 border-blue-100 font-bold text-blue-600 shadow-sm transition-all hover:scale-105"
            variant="flat"
            size="lg"
            radius="full"
            startContent={<FiEdit3 className="text-xl" />}
            onPress={() => navigate(TestRoutes.takeTest)}
          >
            Practice
          </Button>

          <Button
            className="bg-gradient-to-r from-kidemia-secondary 
            to-kidemia-primary text-white font-bold px-10 
            shadow-lg shadow-purple-200 transition-all 
            hover:scale-105 active:scale-95 hover:brightness-110"
            size="lg"
            radius="full"
            startContent={<FiZap className="text-xl" />}
            onPress={() => navigate(SidebarRoutes.takeAssessment)}
          >
            Take Exam
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 
        2xl:grid-cols-5 gap-5 lg:gap-4">
          {statsLoading ? (
            <>
              {[...Array(5)].map((_, idx) => (
                <StatCardSkeleton key={idx} />
              ))}
            </>
          ) : statsError ? (
            <div className="col-span-full text-center py-8 text-red-500">
              Failed to load statistics. Please try again.
            </div>
          ) : (
            <>
              <StatCard
                icon={LuNotebookPen}
                title="No. of Tests Attempted"
                figure={statsData?.stats.tests_attempted.toString() || "0"}
              />
              <StatCard
                icon={LuBookOpenCheck}
                title="Correct Test Questions Answered"
                figure={statsData?.stats.test_correct_answers.toString() || "0"}
              />
              <StatCard
                icon={PiExamFill}
                title="No. of Exams Attempted"
                figure={statsData?.stats.exams_attempted.toString() || "0"}
              />
              <StatCard
                icon={FaSpellCheck}
                title="Correct Exam Questions Answered"
                figure={statsData?.stats.exam_correct_answers.toString() || "0"}
              />
              <StatCard
                icon={MdTimer}
                title="Avg Time per Question"
                figure={statsData?.stats.avg_time_per_question.toString() || "0.00"}
                sub="min per question"
              />
            </>
          )}
        </div>

        {/* Analytics Charts */}
        <div>
          {statsLoading ? (
            <AnalyticsChartSkeleton />
          ) : (
            <AnalyticsChart
              testCategories={statsData?.test_performance_chart.categories || []}
              testDataSeries={statsData?.test_performance_chart.series || []}
              examCategories={statsData?.exam_performance_chart.categories || []}
              examDataSeries={statsData?.exam_performance_chart.series || []}
            />
          )}
        </div>

        {/* Assessment History and Report Summary */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-3">
          <div className="lg:col-span-3 lg:w-[70%]">
            {statsLoading ? (
              <AssessmentHistorySkeleton />
            ) : (
              <AssesstmentHistory
                subjectHistory={statsData?.subject_history || []}
                examHistory={statsData?.exam_history || []}
              />
            )}
          </div>

          <div className="lg:w-[30%]">
            {statsLoading ? (
              <ReportSummarySkeleton />
            ) : (
              <ReportSummary
                testPerformance={statsData?.summary.test_performance || 0}
                examPerformance={statsData?.summary.exam_performance || 0}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Components
function StatCardSkeleton() {
  return (
    <div className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] rounded-lg p-4">
      <div className="pb-5 px-2">
        <div className="flex gap-2 mb-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsChartSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, idx) => (
        <div
          key={idx}
          className="p-5 border border-kidemia-grey/15 rounded-2xl bg-kidemia-white"
        >
          <Skeleton className="h-6 w-48 rounded mb-4" />
          <Skeleton className="h-[300px] w-full rounded" />
        </div>
      ))}
    </div>
  );
}

function AssessmentHistorySkeleton() {
  return (
    <div className="p-5 border border-kidemia-grey/15 rounded-2xl">
      <div className="flex gap-6 mb-4">
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-12 w-full rounded" />
        ))}
      </div>
    </div>
  );
}

function ReportSummarySkeleton() {
  return (
    <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-transparent">
      <Skeleton className="h-6 w-40 rounded mb-4" />
      <div className="space-y-8">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="space-y-4">
            <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
            <Skeleton className="h-4 w-32 rounded mx-auto" />
            <Skeleton className="h-3 w-24 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}