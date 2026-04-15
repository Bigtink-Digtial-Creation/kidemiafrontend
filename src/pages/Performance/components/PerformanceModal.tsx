import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { formatTimeSystem, useFormattedDateTime } from "../../../utils";
import { QueryKeys } from "../../../utils/queryKeys";
import SpinnerCircle from "../../../components/Spinner/Circle";
import { FaTrophy } from "react-icons/fa";

interface ModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  attemptId: string;
  assessmentId: string;
}

export default function PerformanceModal({
  isOpen,
  onOpenChange,
  attemptId,
  assessmentId,
}: ModalI) {
  const { data: attemptData, isLoading } = useQuery({
    queryKey: [QueryKeys.assesstmentAttempt, attemptId],
    queryFn: () =>
      ApiSDK.AttemptsService.getSingleAttemptApiV1AttemptsAttemptIdAttemptGet(
        attemptId
      ),
    enabled: isOpen && !!attemptId,
  });

  const { data: ranking, isLoading: rankLoading } = useQuery({
    queryKey: [QueryKeys.assessmentLeaderboard, assessmentId],
    queryFn: () =>
      ApiSDK.GamificationService.getAssessmentRankingsApiV1GamificationAssessmentIdRankingGet(
        assessmentId
      ),
    enabled: isOpen && !!assessmentId,
  });

  const rank = ranking?.current_user_rank;
  const total = ranking?.total_participants;
  // Prefer the percentile field on the user's entry; fall back to a derived value
  const userEntry = ranking?.entries?.find((e) => e.is_current_user);
  const percentile =
    userEntry?.percentile != null
      ? Math.round(Number(userEntry.percentile))
      : rank != null && total != null && total > 0
        ? Math.round((1 - (rank - 1) / total) * 100)
        : null;

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <SpinnerCircle />
          </div>
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {attemptData?.assessment.title || "Assessment Details"}
              <span className="text-sm text-kidemia-grey">
                Created on:{" "}
                {useFormattedDateTime(attemptData?.started_at!, "date") || "N/A"}
              </span>
            </ModalHeader>

            <ModalBody className="space-y-4 py-6">
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="font-medium text-base text-kidemia-black2">
                    Overall Score
                  </p>
                  <p className="text-3xl font-bold text-kidemia-primary text-center">
                    {attemptData?.percentage != null
                      ? `${Number(attemptData.percentage).toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-base text-kidemia-black2">
                    Total Questions
                  </p>
                  <p className="text-3xl font-bold text-kidemia-primary text-center">
                    {attemptData?.total_questions || 0}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-base text-kidemia-black2">
                    Correct Answers
                  </p>
                  <p className="text-3xl font-bold text-kidemia-primary text-center">
                    {attemptData?.correct_answers || 0}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-base text-kidemia-black2">
                    Time Used
                  </p>
                  <p className="text-3xl font-bold text-kidemia-primary text-center">
                    {formatTimeSystem(attemptData?.time_spent_seconds || 0)}
                  </p>
                </div>
              </div>

              {/* Rank banner */}
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

              {/* Status */}
              <div>
                <p className="font-semibold text-kidemia-black">Status</p>
                <Chip
                  color={
                    attemptData?.status === "graded"
                      ? "success"
                      : attemptData?.status === "in_progress"
                        ? "warning"
                        : "default"
                  }
                  variant="flat"
                  className="capitalize mt-1"
                >
                  {attemptData?.status?.toLowerCase() || "N/A"}
                </Chip>
              </div>

              {/* Feedback */}
              {attemptData?.feedback && (
                <div>
                  <p className="font-semibold text-kidemia-black">
                    Feedback/Comments
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {attemptData.feedback}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-kidemia-black">Submitted At</p>
                  <p className="text-gray-700 mt-1">
                    {attemptData?.status === "graded"
                      ? useFormattedDateTime(attemptData?.submitted_at!, "date")
                      : "Not yet submitted"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-kidemia-black">Graded At</p>
                  <p className="text-gray-700 mt-1">
                    {attemptData?.status === "graded"
                      ? useFormattedDateTime(attemptData?.submitted_at!, "date")
                      : "Not yet graded"}
                  </p>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}