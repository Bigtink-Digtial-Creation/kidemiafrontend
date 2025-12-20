import { Input, Tab, Tabs } from "@heroui/react";
import { TbReportSearch } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PerformanceTable from "./components/PerformanceTable";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";

export default function PerformancePage() {
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter data based on search query
  const filterData = (data: any[]) => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const subjectHistory = statsData?.subject_history || [];
  const examHistory = statsData?.exam_history || [];

  const filteredSubjects = filterData(subjectHistory);
  const filteredExams = filterData(examHistory);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex justify-end items-center">
          <div>
            <Input
              startContent={
                <TbReportSearch className="text-xl text-kidemia-secondary" />
              }
              variant="flat"
              size="lg"
              radius="sm"
              placeholder="Search by subjects or exams"
              fullWidth
              isClearable
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
        </div>
        <div>
          <Tabs
            aria-label="Assessment"
            size="sm"
            variant="underlined"
            fullWidth
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#BF4C20]",
              tab: "max-w-fit- w-full px-0 h-10",
              tabContent:
                "text-sm group-data-[selected=true]:text-[#BF4C20] group-data-[selected=true]:font-semibold",
            }}
          >
            <Tab key="subjects" title="Subjects">
              <PerformanceTable
                data={filteredSubjects}
                isLoading={statsLoading}
                error={statsError}
              />
            </Tab>
            <Tab key="exams" title="Exams">
              <PerformanceTable
                data={filteredExams}
                isLoading={statsLoading}
                error={statsError}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}