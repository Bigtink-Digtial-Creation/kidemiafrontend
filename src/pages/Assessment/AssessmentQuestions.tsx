import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { Spinner } from "@heroui/react";

export default function AssessmentQuestions() {
  const { id } = useParams<{ id: string }>();

  console.log(id);
  const { data: assessmentQuestions, isLoading } = useQuery({
    queryKey: [QueryKeys.assessmentQuestions, id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        id!,
        true,
      ),
    enabled: !!id,
  });

  console.log({ assessmentQuestions });

  if (isLoading || !assessmentQuestions) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return <div>AssessmentQuestions</div>;
}
