import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { Card, CardBody, Spinner } from "@heroui/react";

export default function AssessmentQuestions() {
  const { assessment_id, attempt_id } = useParams<{
    assessment_id: string;
    attempt_id: string;
  }>();

  console.log("Assessment ID:", assessment_id);
  console.log("Attempt ID:", attempt_id);

  const { data: asstQuestions, isLoading } = useQuery({
    queryKey: [QueryKeys.assessmentQuestions, assessment_id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        assessment_id!,
        true,
      ),
    enabled: !!assessment_id,
  });

  console.log({ asstQuestions });

  if (isLoading || !asstQuestions) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="sm" color="warning" />
      </div>
    );
  }

  return (
    <section className="py-4 space-y-12 md:px-12 w-full max-w-4xl">
      <div>
        <Card
          shadow="none"
          className="border border-kidemia-grey/20 bg-kidemia-white"
        >
          <CardBody className="p-6">
            <div className="flex- items-center- justify-between- space-y-1 ">
              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Title:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {asstQuestions.title || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Code:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {asstQuestions.code || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Session:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {asstQuestions.exam_session || "---"},{" "}
                  {asstQuestions.exam_year || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Assessment Type:
                </p>
                <p className="text-kidemia-black text-sm font-medium capitalize text-center">
                  {asstQuestions.assessment_type || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Category:
                </p>
                <p className="text-kidemia-black text-sm font-medium capitalize">
                  {asstQuestions.category || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Description:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {asstQuestions.description || "---"}
                </p>
              </div>

              <div className="py-4">
                <p className="text-kidemia-black text-sm font-medium leading-relaxed whitespace-pre-line">
                  {asstQuestions.instructions ||
                    "No specific instructions provided."}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="py-4">questions here</div>
    </section>
  );
}
