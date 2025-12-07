import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { BiArrowBack, BiPlayCircle, BiQuestionMark } from "react-icons/bi";
import { BsClock } from "react-icons/bs";

import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { selectedTopicsAtom } from "../../store/test.atom";
import LoadingSequence from "../../components/Loading/LoadingSequence";

export default function TestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const selectedTopics = useAtomValue(selectedTopicsAtom);

  const topicIds = selectedTopics.map((t) => t.id);


  const { data: testDetails, isLoading } = useQuery({
    queryKey: [QueryKeys.testDetails, id, topicIds],
    queryFn: ({ queryKey }) => {
      const [, subjectId, topicIds] = queryKey as [
        string,
        string,
        string[],
      ];

      return ApiSDK.AssessmentsService
        .autoGenerateAssessmentApiV1AssessmentsAutoGeneratePost({
          subject_id: subjectId,
          topic_ids: topicIds,
        });
    },
    enabled: !!id && !!topicIds.length,
  });


  const startAttemptMutation = useMutation({
    mutationFn: () =>
      ApiSDK.AttemptsService
        .startAttemptApiV1AttemptsAssessmentIdStartPost(
          testDetails!.assessment_id,
          {},
        ),
    onSuccess: (data) => {
      navigate(
        `/take-a-test/${data.assessment_id}/${data.attempt_id}/questions`,
      );
    },
  });

  if (isLoading || !testDetails) {
    return (
      <LoadingSequence
        lines={[
          {
            text: "Creating your Assessment...",
            className: "text-lg md:text-xl text-kidemia-primary",
          },
          {
            text: "Getting everything together. Hang on",
          },
        ]}
      />
    );
  }

  return (
    <section className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <Card
        shadow="none"
        className="border border-kidemia-grey/20 rounded-xl bg-white"
      >
        <CardBody className="px-6 py-10 space-y-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-kidemia-black">
              Test Information
            </h2>
            <p className="text-sm text-kidemia-grey mt-1">
              Review the test details before you begin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <BsClock className="w-4 h-4 text-kidemia-secondary mt-1" />
              <div>
                <p className="font-medium text-kidemia-black">Duration</p>
                <p>{testDetails.duration_minutes} minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BiQuestionMark className="w-5 h-5 text-kidemia-secondary mt-1" />
              <div>
                <p className="font-medium text-kidemia-black">
                  Total Questions
                </p>
                <p>{testDetails.total_questions}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-kidemia-black">Title</p>
              <p className="text-sm text-kidemia-grey">
                {testDetails.title || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-kidemia-black">Message</p>
              <p className="text-sm text-kidemia-grey">
                {testDetails.message || "No message provided."}
              </p>
            </div>

            <div>
              <p className="font-semibold text-kidemia-black">
                Topics Covered
              </p>
              <p className="text-sm text-kidemia-grey">
                {testDetails.topics_covered?.join(", ") || "N/A"}
              </p>
            </div>
          </div>
        </CardBody>

        {/* Footer actions */}
        <CardFooter className="border-t border-kidemia-grey/10 bg-kidemia-biege/10 px-6 py-6">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-kidemia-grey/70 hidden sm:block">
              Click below to begin your test.
            </p>

            <div className="flex gap-4">
              <Button
                onPress={() => navigate(-1)}
                className="bg-kidemia-secondary"
              >
                <BiArrowBack className="w-5 h-5 text-white" />
              </Button>

              <Button
                className="bg-kidemia-secondary text-white font-semibold px-6 py-3"
                startContent={<BiPlayCircle className="w-5 h-5" />}
                isLoading={startAttemptMutation.isPending}
                isDisabled={startAttemptMutation.isPending}
                onPress={() => startAttemptMutation.mutate()}
              >
                Start Test
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
