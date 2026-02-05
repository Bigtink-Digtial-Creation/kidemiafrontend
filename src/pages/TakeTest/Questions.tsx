import { useEffect, useMemo, useRef, useState } from "react";
import {
  addToast,
  Button,
  Pagination,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAtom, useSetAtom } from "jotai";
import {
  selectedAnswersAtom,
  testAttemptResultAtom,
} from "../../store/test.atom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useNavigate, useParams } from "react-router";
import { formatTime } from "../../utils";
import type { SaveAnswerRequest } from "../../sdk/generated";
import { apiErrorParser } from "../../utils/errorParser";
import { useResetAtom } from "jotai/utils";
import LoadingSequence from "../../components/Loading/LoadingSequence";
import { useInvalidateQueries } from "../../hooks/use-invalidate-queries";

type AnswerOption = string;

export default function QuestionsPage() {
  const { assessment_id, attempt_id } = useParams<{
    assessment_id: string;
    attempt_id: string;
  }>();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useAtom(selectedAnswersAtom);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  const hasSubmittedRef = useRef(false);
  const timerStartedRef = useRef(false);

  const setAttemptResult = useSetAtom(testAttemptResultAtom);
  const resetAns = useResetAtom(selectedAnswersAtom);
  const navigate = useNavigate();
  const invalidateQueries = useInvalidateQueries();

  const { data: questionsData, isLoading } = useQuery<any>({
    queryKey: [QueryKeys.allQuestions, assessment_id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        assessment_id!,
        true,
      ),
    enabled: !!assessment_id,
  });

  const allQuestions = useMemo(() => {
    if (!questionsData?.questions) return [];
    return questionsData.questions.map((q: any) => ({
      ...q,
      topicTitle: questionsData.title,
    }));
  }, [questionsData]);

  const currentQuestion = allQuestions[currentIndex];

  const saveAnsMutation = useMutation({
    mutationFn: async ({
      attempt_id,
      requestBody,
    }: {
      attempt_id: string;
      requestBody: SaveAnswerRequest;
    }) => {
      return ApiSDK.AttemptsService.saveAnswerApiV1AttemptsAttemptIdAnswerPost(
        attempt_id,
        requestBody,
      );
    },
    onError(error) {
      addToast({
        title: apiErrorParser(error).message,
        color: "warning",
      });
    },
  });

  const submitAttemptMutation = useMutation({
    mutationFn: (attemptId: string) =>
      ApiSDK.AttemptsService.submitAttemptApiV1AttemptsAttemptIdSubmitPost(
        attemptId,
      ),
    onMutate() {
      setIsSubmitting(true);
    },
    onSuccess(data) {
      setAttemptResult(data);
      invalidateQueries([QueryKeys.leaderboard]);
      addToast({
        description: "Attempt Submitted Successfully",
        color: "success",
      });
      resetAns();
      navigate(`/take-a-test/results/${assessment_id}`);
    },
    onError(error) {
      setIsSubmitting(false);
      addToast({
        description: apiErrorParser(error).message,
        color: "danger",
      });
    },
  });

  const saveCurrentAnswer = async () => {
    const selectedOptionId = selectedAnswers[currentIndex];
    const questionId = currentQuestion?.id;

    if (!selectedOptionId || !questionId) return;

    await saveAnsMutation.mutateAsync({
      attempt_id: attempt_id!,
      requestBody: {
        question_id: questionId,
        selected_option_ids: [selectedOptionId],
      },
    });
  };

  const safeSubmit = async () => {
    if (hasSubmittedRef.current || !attempt_id) return;
    hasSubmittedRef.current = true;

    try {
      await saveCurrentAnswer();
    } finally {
      submitAttemptMutation.mutate(attempt_id);
    }
  };

  const handleAnswerSelect = (value: AnswerOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const handleNext = async () => {
    try {
      await saveCurrentAnswer();
      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch {
      addToast({
        title: "Failed to save answer",
        color: "danger",
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (
      timerStartedRef.current ||
      isLoading ||
      !questionsData?.duration_minutes
    ) {
      return;
    }

    timerStartedRef.current = true;
    const totalSeconds = questionsData.duration_minutes * 60;
    setTimeLeft(totalSeconds);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);

          addToast({
            title: "Time's up!",
            description: "Submitting your test automatically...",
            color: "warning",
          });

          safeSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, questionsData?.duration_minutes]);

  if (isLoading || !currentQuestion) {
    return (
      <LoadingSequence
        lines={[
          { text: "Loading your questions...", className: "text-lg" },
          { text: "Please wait..." },
        ]}
      />
    );
  }

  if (isSubmitting || submitAttemptMutation.isPending) {
    return (
      <LoadingSequence
        lines={[
          {
            text: isTimeUp
              ? "⏰ Time's up! Submitting your test..."
              : "Submitting your assessment...",
            className: "text-2xl font-semibold",
          },
          {
            text: "Please do not close or refresh this page.",
          },
        ]}
      />
    );
  }

  return (
    <section className="py-4 space-y-12 md:px-12 w-full max-w-4xl">
      <div className="absolute top-0 right-0 px-8 pt-2.5">
        <p className="text-md font-medium">
          Time Left: {formatTime(timeLeft)}
        </p>
      </div>

      <div className="hidden pt-2">
        <h3 className="text-lg font-semibold text-center">
          Topic: {currentQuestion.topic_name}
        </h3>
      </div>

      <div className="py-4">
        <h2 className="text-xl font-semibold">
          Question {currentIndex + 1}
        </h2>
        <p className="text-lg">{currentQuestion.question_text}</p>

        <RadioGroup
          value={selectedAnswers[currentIndex] || ""}
          onValueChange={handleAnswerSelect}
          className="py-6 space-y-6"
        >
          {currentQuestion.options.map((option: any) => (
            <Radio key={option.id} value={option.id}>
              {option.option_text}
            </Radio>
          ))}
        </RadioGroup>
      </div>

      <div className="flex gap-6 py-6">
        <Button
          onPress={handlePrev}
          isDisabled={currentIndex === 0}
          startContent={<FaArrowLeft />}
        >
          Previous
        </Button>

        {currentIndex === allQuestions.length - 1 ? (
          <Button
            onPress={safeSubmit}
            isDisabled={!selectedAnswers[currentIndex]}
            color="success"
            className="bg-kidemia-secondary text-white"
          >
            Submit
          </Button>
        ) : (
          <Button
            onPress={handleNext}
            isDisabled={!selectedAnswers[currentIndex]}
            endContent={<FaArrowRight />}
            color="primary"
            className="bg-kidemia-secondary text-white"
          >
            Next
          </Button>
        )}
      </div>

      <Pagination
        page={currentIndex + 1}
        total={allQuestions.length}
        onChange={(page) => setCurrentIndex(page - 1)}
        classNames={{
          item: "text-kidemia-black2",
          cursor: "bg-kidemia-secondary text-white",
          prev: "text-kidemia-secondary",
          next: "text-kidemia-secondary",
        }}
      />
    </section>
  );
}
