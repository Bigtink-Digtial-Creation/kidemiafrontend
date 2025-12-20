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
}: ModalI) {
  const { data: attemptData, isLoading } = useQuery({
    queryKey: [QueryKeys.assesstmentAttempt],
    queryFn: async () => {
      return ApiSDK.AttemptsService.getSingleAttemptApiV1AttemptsAttemptIdAttemptGet(
        attemptId
      );
    },
    enabled: isOpen && !!attemptId,
  });



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
                Created on: {useFormattedDateTime(attemptData?.started_at!, 'date') || "N/A"}
              </span>
            </ModalHeader>
            <ModalBody className="space-y-4 py-6">
              {/* Average Score */}
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
                    {formatTimeSystem(attemptData?.time_spent_seconds || 0.0)}
                  </p>
                </div>
              </div>

              {/* Status */}
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


              {/* Comments */}
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

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-kidemia-black">
                    Submitted At
                  </p>
                  <p className="text-gray-700 mt-1">
                    {attemptData!.status === 'graded'
                      ? useFormattedDateTime(attemptData?.submitted_at!, 'date')
                      : "Not yet submitted"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-kidemia-black">Graded At</p>
                  <p className="text-gray-700 mt-1">
                    {attemptData!.status === 'graded'
                      ? useFormattedDateTime(attemptData?.submitted_at!, 'date')
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