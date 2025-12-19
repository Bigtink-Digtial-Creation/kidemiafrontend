import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { TopThreeSkeleton } from "./components/TopThreeSkeleton";
import { CategoryFilter } from "./components/CategoryFilter";
import { TopThreePanel } from "./components/TopThreePanel";
import { RankListSkeleton } from "./components/RankListSkeleton";
import { RankList } from "./components/RankList";
import { EmptyLeaderboardState } from "./components/EmptyLeaderboardState";
import type { LeaderboardEntryResponse } from "../../sdk/generated";
import { loggedinUserAtom } from "../../store/user.atom";
import { useAtomValue } from "jotai";
import { QueryKeys } from "../../utils/queryKeys";

export default function StudentLeaderboard() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const storedUser = useAtomValue(loggedinUserAtom);
  const currentUserId = storedUser?.user?.student?.id;


  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: [QueryKeys.categories],
    queryFn: async () => {
      return ApiSDK.AssessmentCategoriesService.getCategoryConfigsApiV1CategoriesGet();
    },
  });

  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery({
    queryKey: [QueryKeys.leaderboard, activeCategory],
    queryFn: async () => {
      if (activeCategory === "all") {
        return ApiSDK.GamificationService.getLeaderboardApiV1GamificationLeaderboardGet();
      }
      return ApiSDK.GamificationService.getLeaderboardApiV1GamificationLeaderboardGet(
        undefined,
        undefined,
        activeCategory,
        undefined
      );
    },
  });

  const topThree: LeaderboardEntryResponse[] = leaderboardData?.entries?.slice(0, 3) || [];
  const hasEntries = leaderboardData?.entries && leaderboardData.entries.length > 0;
  const isLoading = leaderboardLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-500 text-xs md:text-sm">Compete with learners across the world</p>
          </div>
        </div>

        <CategoryFilter
          active={activeCategory}
          setActive={setActiveCategory}
          categories={categoriesData || []}
          isLoading={categoriesLoading}
        />

        {leaderboardError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">Failed to load leaderboard. Please try again.</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-5">
              <TopThreeSkeleton />
            </div>
            <div className="lg:col-span-7">
              <RankListSkeleton />
            </div>
          </div>
        ) : !hasEntries ? (
          <div className="grid lg:grid-cols-12 gap-4 md:gap-6">
            <EmptyLeaderboardState />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-5">
              <TopThreePanel students={topThree} currentUserId={currentUserId} />
            </div>
            <div className="lg:col-span-7">
              <RankList students={leaderboardData?.entries || []} currentUserId={currentUserId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}