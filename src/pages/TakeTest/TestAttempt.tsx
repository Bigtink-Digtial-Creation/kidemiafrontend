import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { SidebarRoutes, TestRoutes } from "../../routes";
import { useAtomValue } from "jotai";
import { selectedSubjectIdeAtom } from "../../store/test.atom";
import {
  BiCalendar,
  BiPlayCircle,
  BiQuestionMark,
  BiShield,
} from "react-icons/bi";
import { FiFileText } from "react-icons/fi";
import { BsClock } from "react-icons/bs";
import SpinnerCircle from "../../components/Spinner/Circle";

export default function TestAttempt() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const subjectId = useAtomValue(selectedSubjectIdeAtom);
  const navigate = useNavigate();

  const { data: attemptTest, isLoading } = useQuery({
    queryKey: [QueryKeys.testAttempt, assessmentId],
    queryFn: () =>
      ApiSDK.AttemptsService.startAttemptApiV1AttemptsAssessmentIdStartPost(
        assessmentId!,
        {},
      ),
    enabled: !!assessmentId,
  });

  if (isLoading || !attemptTest) {
    return <>
      <div className="h-screen flex justify-center items-center">
        < SpinnerCircle />
      </div>
    </>;
  }

  const {
    attempt_id,
    assessment_id,
    duration_minutes,
    must_submit_by,
    total_questions,
    instructions,
    proctoring_required,
  } = attemptTest;

  return (
    <section className="max-w-5xl w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-0 px-4">
        <div>
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem href={SidebarRoutes.dashboard}>
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem href={TestRoutes.takeTest}>
              Take a Test
            </BreadcrumbItem>
            <BreadcrumbItem href={TestRoutes.testSubjects}>
              Pick a Subject
            </BreadcrumbItem>

            <BreadcrumbItem href={`/take-a-test/subjects/${subjectId}`}>
              Pick Subject Topics
            </BreadcrumbItem>

            <BreadcrumbItem href={`/take-a-test/${subjectId}/instructions`}>
              Test Instructions
            </BreadcrumbItem>
            <BreadcrumbItem href={`/take-a-test/${subjectId}/details`}>
              Test Details
            </BreadcrumbItem>
            <BreadcrumbItem color="warning">Test Attempt</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>

      <div>
        <Card
          shadow="none"
          className="border border-kidemia-grey/20 bg-kidemia-white"
        >
          <CardBody className="space-y-6 py-6 px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-kidemia-black">
                Test Assessment Details
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-kidemia-grey/70">
                <BiShield className="w-5 h-5 text-kidemia-secondary" />
                <span className="text-sm font-medium text-kidemia-secondary">
                  {proctoring_required ? "Proctored" : "Unproctored"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div>
                  <p className="font-medium text-kidemia-black">Attempt</p>
                  <p>#{attemptTest.attempt_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BsClock className="w-4 h-4 text-kidemia-secondary" />
                <div>
                  <p className="font-medium text-kidemia-black">Duration</p>
                  <p>{duration_minutes} minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BiQuestionMark className="w-4 h-4 text-kidemia-secondary" />
                <div>
                  <p className="font-medium text-kidemia-black">Questions</p>
                  <p>{total_questions} total</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BiCalendar className="w-4 h-4 text-kidemia-secondary" />
                <div>
                  <p className="font-medium text-kidemia-black">Submit By</p>
                  <p className="text-xs sm:text-sm">
                    {new Date(must_submit_by).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Proctoring Badge - Mobile */}
            <div className="sm:hidden flex items-center gap-2 text-kidemia-grey/70">
              <BiShield className="w-4 h-4 text-kidemia-secondary" />
              <span className="text-sm font-medium text-kidemia-secondary">
                {proctoring_required ? "Proctored Exam" : "No Proctoring"}
              </span>
            </div>

            <div className="border-t border-kidemia-grey/20 pt-5">
              <h3 className="text-lg font-semibold text-kidemia-black mb-2">
                Instructions
              </h3>
              <p className="text-kidemia-grey text-sm leading-relaxed whitespace-pre-line">
                {instructions || "No specific instructions provided."}
              </p>
            </div>
          </CardBody>

          <CardFooter className="bg-kidemia-biege/10 border-t border-kidemia-grey/10 px-6 py-4">
            <div className="w-full flex justify-between items-center">
              <p className="text-xs text-kidemia-grey/70 hidden sm:block">
                Click to begin your assessment
              </p>
              <Button
                className="bg-kidemia-secondary text-white font-semibold shadow-md hover:shadow-lg"
                size="lg"
                radius="md"
                startContent={<BiPlayCircle className="w-5 h-5" />}
                onPress={() =>
                  navigate(
                    `/take-a-test/${assessment_id}/${attempt_id}/questions`,
                  )
                }
              >
                Start Test Assessment
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
