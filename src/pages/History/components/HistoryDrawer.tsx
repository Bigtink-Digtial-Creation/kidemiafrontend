import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Divider,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { QueryKeys } from "../../../utils/queryKeys";
import { formatTimeSystem, useFormattedDateTime } from "../../../utils";
import SpinnerCircle from "../../../components/Spinner/Circle";
import { FaTrophy } from "react-icons/fa";

interface DrawerI {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string | null;
  assessmentId?: string | null;
}

export default function HistoryDrawer({
  isOpen,
  onOpenChange,
  id,
  assessmentId,
}: DrawerI) {
  const { data: attemptData, isLoading } = useQuery({
    queryKey: [QueryKeys.assesstmentAttempt, id],
    queryFn: () =>
      ApiSDK.AttemptsService.getSingleAttemptApiV1AttemptsAttemptIdAttemptGet(
        id!
      ),
    enabled: isOpen && !!id,
  });

  // Use prop if available, otherwise read from loaded attempt
  const resolvedAssessmentId =
    assessmentId ?? attemptData?.assessment?.id ?? null;

  const { data: leaderboard, isLoading: rankLoading } = useQuery({
    queryKey: [QueryKeys.assessmentLeaderboard, resolvedAssessmentId],
    queryFn: () =>
      ApiSDK.GamificationService.getAssessmentRankingsApiV1GamificationAssessmentIdRankingGet(
        resolvedAssessmentId!
      ),
    enabled: isOpen && !!resolvedAssessmentId,
  });

  const rank = leaderboard?.current_user_rank;
  const total = leaderboard?.total_participants;
  const userEntry = leaderboard?.entries?.find((e) => e.is_current_user);
  const percentile =
    userEntry?.percentile != null
      ? Math.round(Number(userEntry.percentile))
      : rank != null && total != null && total > 0
        ? Math.round((1 - (rank - 1) / total) * 100)
        : null;

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg" backdrop="blur">
      <DrawerContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <SpinnerCircle width={50} height={50} />
          </div>
        ) : (
          <>
            <DrawerHeader className="flex flex-col gap-1 text-xl font-bold">
              {attemptData?.assessment.title || "Assessment Details"}
            </DrawerHeader>

            <DrawerBody className="space-y-6">
              {/* General Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200">
                  <p className="font-semibold">Average Score</p>
                  <p className="text-indigo-700 font-bold text-xl">
                    {attemptData?.percentage || 0}%
                  </p>
                </div>

                {attemptData?.feedback && (
                  <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-pink-100 to-pink-200">
                    <p className="font-semibold">Remark</p>
                    <p className="text-pink-700">{attemptData.feedback}</p>
                  </div>
                )}

                <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-200">
                  <p className="font-semibold">Date Taken</p>
                  <p className="text-yellow-700">
                    {useFormattedDateTime(attemptData?.started_at!, "date") || "N/A"}
                  </p>
                </div>

                <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-green-100 to-green-200">
                  <p className="font-semibold">Time Used</p>
                  <p className="text-green-700">
                    {formatTimeSystem(attemptData?.time_spent_seconds!) || 0} Minutes
                  </p>
                </div>

                <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
                  <p className="font-semibold">Questions Attempted</p>
                  <p className="text-blue-700">
                    {attemptData?.questions_attempted || 0}
                  </p>
                </div>
              </div>

              {/* Rank card */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <FaTrophy className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-sm font-semibold text-amber-800">
                    Your Ranking
                  </p>
                </div>

                {rankLoading ? (
                  <div className="flex items-center gap-2 py-1">
                    <SpinnerCircle width={18} height={18} />
                    <span className="text-sm text-amber-600">Loading…</span>
                  </div>
                ) : rank != null ? (
                  <div className="grid grid-cols-3 divide-x divide-amber-200 text-center">
                    <div className="pr-4">
                      <p className="text-xs text-amber-600 mb-0.5">Rank</p>
                      <p className="text-2xl font-bold text-amber-900 leading-tight">
                        #{rank}
                      </p>
                    </div>
                    <div className="px-4">
                      <p className="text-xs text-amber-600 mb-0.5">Participants</p>
                      <p className="text-2xl font-bold text-amber-900 leading-tight">
                        {total ?? "—"}
                      </p>
                    </div>
                    <div className="pl-4">
                      <p className="text-xs text-amber-600 mb-0.5">Percentile</p>
                      <p className="text-2xl font-bold text-amber-900 leading-tight">
                        {percentile != null ? `Top ${percentile}%` : "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-amber-600">
                    Not ranked yet — submit an attempt to appear on the leaderboard.
                  </p>
                )}
              </div>

              {/* Tutor Comment */}
              {attemptData?.feedback && (
                <>
                  <Divider />
                  <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200">
                    <p className="font-semibold mb-1">Tutor's Comment</p>
                    <p className="text-sm text-purple-800">
                      {attemptData.feedback}
                    </p>
                  </div>
                </>
              )}

              <Divider />

              {/* Topics Breakdown */}
              <div>
                <p className="font-semibold mb-3 text-lg">
                  Topics Covered (
                  {attemptData?.assessment.subject.topics_count || 0})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attemptData?.assessment.subject.topics?.map(
                    (topic, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl text-white shadow-md bg-kidemia-secondary"
                      >
                        <p className="font-bold text-lg">{topic.name}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}