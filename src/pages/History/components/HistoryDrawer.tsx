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

interface DrawerI {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string | null;
}

export default function HistoryDrawer({ isOpen, onOpenChange, id }: DrawerI) {

  const { data: attemptData, isLoading } = useQuery({
    queryKey: [QueryKeys.assesstmentAttempt],
    queryFn: async () => {
      return ApiSDK.AttemptsService.getSingleAttemptApiV1AttemptsAttemptIdAttemptGet(
        id!
      );
    },
    enabled: isOpen && !!id,
  });


  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        backdrop="blur"
      >
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
                    <p className="text-yellow-700">{useFormattedDateTime(attemptData?.started_at!, 'date') || "N/A"}</p>
                  </div>
                  <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-green-100 to-green-200">
                    <p className="font-semibold">Time Used</p>
                    <p className="text-green-700">{formatTimeSystem(attemptData?.time_spent_seconds!) || 0} Minutes</p>
                  </div>
                  <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
                    <p className="font-semibold">Questions Attempted</p>
                    <p className="text-blue-700">
                      {attemptData?.questions_attempted || 0}
                    </p>
                  </div>
                </div>



                {/* Tutor Comment */}
                {attemptData?.feedback && (
                  <>
                    <Divider />
                    <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200">
                      <p className="font-semibold mb-1">Tutor’s Comment</p>
                      <p className="text-sm text-purple-800">
                        {attemptData?.feedback}
                      </p>
                    </div>
                  </>
                )}

                <Divider />

                {/* Topics Breakdown */}
                <div>
                  <p className="font-semibold mb-3 text-lg">
                    Topics Covered ({attemptData?.assessment.subject.topics_count || 0})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attemptData?.assessment.subject.topics!.map((topic, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl text-white shadow-md bg-kidemia-secondary`}
                      >
                        <p className="font-bold text-lg">{topic.name}</p>
                        <p className="text-sm">
                          Questions:{" "}
                          <span className="font-semibold">{topic.questions_count}</span>
                        </p>

                      </div>
                    ))}
                  </div>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
