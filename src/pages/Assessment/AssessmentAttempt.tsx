import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { Spinner, Button, Card, CardBody, CardFooter } from "@heroui/react";
import {
  BiCalendar,
  BiPlayCircle,
  BiQuestionMark,
  BiShield,
} from "react-icons/bi";
import { BsClock } from "react-icons/bs";

export default function AssessmentInstructions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.assesstmentAttempt, id],
    queryFn: () =>
      ApiSDK.AttemptsService.startAttemptApiV1AttemptsAssessmentIdStartPost(
        id!,
        {},
      ),
    enabled: !!id,
  });

  if (isLoading || !data) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  const {
    attempt_id,
    assessment_id,
    duration_minutes,
    must_submit_by,
    total_questions,
    instructions,
    proctoring_required,
  } = data;

  return (
    <section className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* PAGE TITLE */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-kidemia-black">
          Assessment Instructions
        </h1>
        <p className="text-sm text-kidemia-grey mt-1">
          Carefully review the details below before you begin.
        </p>
      </div>

      {/* PROCTORING WARNING */}
      {proctoring_required && (
        <div className="mb-8 p-4 rounded-lg border border-red-300 bg-red-50 flex items-start gap-3">
          <BiShield className="text-red-500 w-6 h-6 mt-1" />
          <div>
            <p className="font-semibold text-red-600 text-sm">
              This is a Proctored Assessment
            </p>
            <p className="text-red-600 text-xs leading-relaxed">
              Your camera, screen activity, and environment may be monitored to
              ensure fairness. Please sit in a quiet location with stable
              internet and avoid switching apps or minimizing your screen.
            </p>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <Card
        shadow="none"
        className="border border-kidemia-grey/20 rounded-xl bg-white"
      >
        <CardBody className="px-6 py-10 space-y-10">
          {/* OVERVIEW HEADER */}
          <div className="flex justify-between items-start">
            <h2 className="text-xl sm:text-2xl font-bold text-kidemia-black">
              Assessment Overview
            </h2>

            {/* Desktop Proctor Label */}
            {proctoring_required && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 border border-red-200">
                <BiShield className="text-red-500 w-4 h-4" />
                <span className="text-xs font-semibold text-red-600">
                  Proctored
                </span>
              </div>
            )}
          </div>

          {/* META GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {/* Duration */}
            <div className="flex items-start gap-3">
              <BsClock className="w-4 h-4 text-kidemia-secondary mt-1" />
              <div>
                <p className="font-medium text-kidemia-black">Duration</p>
                <p>{duration_minutes} minutes</p>
              </div>
            </div>

            {/* Questions */}
            <div className="flex items-start gap-3">
              <BiQuestionMark className="w-5 h-5 text-kidemia-secondary mt-1" />
              <div>
                <p className="font-medium text-kidemia-black">Questions</p>
                <p>{total_questions} total</p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-start gap-3">
              <BiCalendar className="w-5 h-5 text-kidemia-secondary mt-1" />
              <div>
                <p className="font-medium text-kidemia-black">Submit Before</p>
                <p className="text-xs sm:text-sm">
                  {new Date(must_submit_by).toLocaleString("en-US", {
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

          {/* MOBILE PROCTOR BADGE */}
          {proctoring_required && (
            <div className="flex sm:hidden items-center gap-2 text-red-600 font-semibold text-sm">
              <BiShield className="w-4 h-4" />
              <span>Proctored Assessment</span>
            </div>
          )}

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-kidemia-black mb-3">
              Before You Start
            </h3>
            <div className="text-kidemia-grey text-sm leading-relaxed whitespace-pre-line">
              {instructions?.trim() ||
                "No special instructions were provided for this assessment."}
            </div>
          </div>
        </CardBody>

        {/* FOOTER */}
        <CardFooter className="border-t border-kidemia-grey/10 bg-kidemia-biege/10 px-6 py-6">
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-kidemia-grey/70 hidden sm:block">
              When you’re ready, click below to begin.
            </p>

            <Button
              className="bg-kidemia-secondary text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg transition"
              radius="md"
              startContent={<BiPlayCircle className="w-5 h-5" />}
              onPress={() =>
                navigate(`/assessment/${assessment_id}/${attempt_id}/questions`)
              }
            >
              Start Assessment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
