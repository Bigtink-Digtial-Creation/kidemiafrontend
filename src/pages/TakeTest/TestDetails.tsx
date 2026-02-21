import { useMemo, useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addToast, Button, Card, CardBody, CardFooter, useDisclosure } from "@heroui/react";
import { BiArrowBack, BiPlayCircle, BiQuestionMark } from "react-icons/bi";
import { BsClock } from "react-icons/bs";

import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { selectedTopicsAtom } from "../../store/test.atom";
import LoadingSequence from "../../components/Loading/LoadingSequence";
import { getApiErrorMessage, getPaymentErrorMessage } from "../../utils/errorParser";
import { AccessDeniedModal } from "../../components/AccessDeniedModal";

export default function TestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const selectedTopics = useAtomValue(selectedTopicsAtom);


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalConfig, setModalConfig] = useState<{
    type: "subscription" | "token" | "general";
    message: string;
  }>({ type: "general", message: "" });

  const topicIds = useMemo(() => selectedTopics.map((t) => t.id), [selectedTopics]);
  const queryKey = useMemo(() => [QueryKeys.testDetails, id, topicIds.join(',')], [id, topicIds]);

  const { data: testDetails, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => ApiSDK.AssessmentsService.autoGenerateAssessmentApiV1AssessmentsAutoGeneratePost({
      subject_id: id!,
      topic_ids: topicIds,
    }),
    enabled: !!id && topicIds.length > 0,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      const is402 = (error as any)?.status === 402;
      setModalConfig({
        type: is402 ? "subscription" : "general",
        message: getPaymentErrorMessage(error) || "Failed to generate assessment."
      });
      onOpen();
    }
  }, [isError, error, onOpen]);

  const startAttemptMutation = useMutation({
    mutationFn: async () => {
      if (!testDetails?.assessment_id) throw new Error("No assessment ID available");
      return ApiSDK.AttemptsService.startTestAttemptApiV1AttemptsTestAssessmentIdStartPost(
        testDetails.assessment_id, {}
      );
    },
    onSuccess: (data) => {
      navigate(`/take-a-test/${data.assessment_id}/${data.attempt_id}/questions`);
    },
    onError: (err: any) => {
      const detail = err.body?.detail;
      const is402 = err?.status === 402 || detail?.allowed === false;

      if (is402) {
        setModalConfig({
          type: detail?.wallet_cost ? "token" : "subscription",
          message: detail?.upgrade_suggestion || detail?.reason || "Access restricted."
        });
        onOpen();
      } else {
        addToast({ title: "Error", description: getApiErrorMessage(err), color: "danger" });
      }
    },
  });

  if (isLoading) return <LoadingSequence lines={[{ text: "Creating your Test..." }]} />;

  return (
    <section className="max-w-4xl mx-auto mt-10 px-4">

      <AccessDeniedModal
        isOpen={isOpen}
        onClose={onClose}
        type={modalConfig.type}
        message={modalConfig.message}
      />

      <Card shadow="none" className="border border-kidemia-grey/20 rounded-xl bg-white">
        <CardBody className="px-6 py-10 space-y-10">
          <h2 className="text-xl sm:text-2xl font-bold">Test Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <BsClock className="w-4 h-4 text-kidemia-secondary mt-1" />
              <div>
                <p className="font-medium">Duration</p>
                <p>{testDetails?.duration_minutes || "--"} minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BiQuestionMark className="w-5 h-5 text-kidemia-secondary mt-1" />
              <div>
                <p className="font-medium">Total Questions</p>
                <p>{testDetails?.total_questions || "--"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold">Topics Covered</p>
              <p className="text-sm text-kidemia-grey">{testDetails?.topics_covered?.join(", ") || "N/A"}</p>
            </div>
          </div>
        </CardBody>

        <CardFooter className="border-t px-6 py-6">
          <div className="flex gap-4 ml-auto">
            <Button onPress={() => navigate(-1)} className="bg-kidemia-secondary">
              <BiArrowBack className="w-5 h-5 text-white" />
            </Button>
            <Button
              className="bg-kidemia-secondary text-white font-semibold"
              startContent={<BiPlayCircle className="w-5 h-5" />}
              isLoading={startAttemptMutation.isPending}
              onPress={() => startAttemptMutation.mutate()}
            >
              Start Test
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}