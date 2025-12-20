import { Tab, Tabs } from "@heroui/react";
import HistoryTable from "./components/HistoryTable";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";

export default function HistoryPage() {

  const [searchQuery] = useState("");

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
      <div>

      </div>

      <div className="space-y-3">
        <div>
          <Tabs
            aria-label="Assessment"
            size="sm"
            variant="underlined"
            fullWidth
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-kidemia-primary",
              tab: "max-w-fit- w-full px-0 h-10",
              tabContent:
                "text-sm  group-data-[selected=true]:text-kidemia-primary group-data-[selected=true]:font-semibold",
            }}
          >
            <Tab key="test" title="Test History">
              <HistoryTable
                data={filteredSubjects}
                isLoading={statsLoading}
                error={statsError} />
            </Tab>
            <Tab key="exam" title="Exam History">
              <HistoryTable
                data={filteredExams}
                isLoading={statsLoading}
                error={statsError} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
