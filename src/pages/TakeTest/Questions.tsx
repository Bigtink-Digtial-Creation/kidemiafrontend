import { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Pagination,
  Radio,
  RadioGroup,
  Spinner,
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

  const setAttemptResult = useSetAtom(testAttemptResultAtom);
  const resetAns = useResetAtom(selectedAnswersAtom);
  const navigate = useNavigate();

  const { data: questionsData, isLoading } = useQuery<any>({
    queryKey: [QueryKeys.allQuestions, assessment_id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        assessment_id!,
        true,
      ),
    enabled: !!assessment_id,
  });

  // flatten and memoize questions for easy navigations
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
      return await ApiSDK.AttemptsService.saveAnswerApiV1AttemptsAttemptIdAnswerPost(
        attempt_id,
        requestBody,
      );
    },
    onSuccess: (data) => {
      console.log("❌ Answer saved:", data);
    },
    onError: (error) => {
      console.error("❌ Failed to submit answer:", error);
    },
  });

  const handleAnswerSelect = (value: AnswerOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const handleNext = async () => {
    const selectedOptionId = selectedAnswers[currentIndex];
    const currentQuestionId = currentQuestion?.id;

    if (!selectedOptionId || !currentQuestionId) return;

    try {
      await saveAnsMutation.mutateAsync({
        attempt_id: attempt_id!,
        requestBody: {
          question_id: currentQuestionId,
          selected_option_ids: [selectedOptionId],
        },
      });

      // Only move to next question on success
      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.name,
        color: "danger",
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // submit mutation
  const submitAttemptMutation = useMutation({
    mutationFn: (attemptId: string) =>
      ApiSDK.AttemptsService.submitAttemptApiV1AttemptsAttemptIdSubmitPost(
        attemptId,
      ),
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess(data) {
      setAttemptResult(data);
      addToast({
        description: "Attempt Submitted Successfull",
        color: "success",
      });
      setTimeout(() => {
        navigate(`/take-a-test/results/${assessment_id}`);
      }, 800);
    },
    onError(error) {
      setIsSubmitting(false);
      const parsedError = apiErrorParser(error);
      addToast({
        description: parsedError.message,
        color: "danger",
      });
    },
  });

  useEffect(() => {
    if (!isLoading && questionsData?.duration_minutes) {
      const durationInSeconds = questionsData.duration_minutes * 60;

      setTimeLeft(durationInSeconds);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimeUp(true);

            addToast({
              title: "Time's up!",
              description: "Submitting your answers automatically...",
              color: "warning",
            });

            //Trigger auto-submit when time runs out
            if (attempt_id && !submitAttemptMutation.isPending) {
              submitAttemptMutation.mutate(attempt_id);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, questionsData?.duration_minutes]);

  const handleSubmit = (attemptId: string) => {
    submitAttemptMutation.mutate(attemptId);
    resetAns();
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Spinner size="sm" color="warning" />
        <p className="pt-2 text-base italic text-kidemia-black text-center">
          Loading Questions...
        </p>
      </div>
    );
  }

  if (isSubmitting || submitAttemptMutation.isPending || isTimeUp) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center space-y-4 px-4">
        <Spinner size="lg" color="warning" />
        <h2 className="text-2xl md:text-3xl font-semibold text-kidemia-black">
          {isTimeUp
            ? "⏰ Time's up! Submitting your test..."
            : "Relax, your result is cooking 🍳"}
        </h2>
        <p className="text-lg text-kidemia-grey max-w-md">
          {isTimeUp
            ? "Don't worry,we're saving all your progress and wrapping things up for you."
            : "We're adding the final touches to your test assessment. Hang tight while we finish up!"}
        </p>
        <p className="text-base text-kidemia-secondary italic">
          Please don't close or refresh this page.
        </p>
      </div>
    );
  }

  return (
    <section className="py-4 space-y-12 md:px-12 w-full max-w-4xl">
      <div className="absolute top-0 right-0 px-8 pt-2.5">
        <div className="flex justify-between flex-col md:flex-row items-center gap-2 space-x-6">
          <p className="text-md text-kidemia-black font-medium">
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-semibold text-kidemia-primary text-center">
          Topic: {currentQuestion.topic_name}
        </h3>
      </div>

      <div className="py-4">
        <div className="space-y-3">
          <h2 className="text-xl text-kidemia-black font-semibold">
            Question {currentIndex + 1}
          </h2>
          <p className="text-lg text-kidemia-grey font-medium">
            {currentQuestion.question_text}
          </p>
        </div>

        <div className="py-6">
          <RadioGroup
            value={selectedAnswers[currentIndex] || ""}
            onValueChange={handleAnswerSelect}
            classNames={{
              wrapper: "space-y-6",
            }}
          >
            {currentQuestion.options.map((option: any) => (
              <Radio
                key={option.id}
                value={option.id}
                className="text-kidemia-grey font-medium"
                color="warning"
              >
                {option.option_text}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center space-x-6 py-6">
        <Button
          className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
          variant="faded"
          size="md"
          radius="sm"
          type="button"
          startContent={<FaArrowLeft />}
          onPress={handlePrev}
          isDisabled={currentIndex === 0}
        >
          Previous
        </Button>

        {currentIndex === allQuestions.length - 1 ? (
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            onPress={() => handleSubmit(attempt_id!)}
            isDisabled={
              !selectedAnswers[currentIndex] || submitAttemptMutation.isPending
            }
            isLoading={submitAttemptMutation.isPending}
          >
            {submitAttemptMutation.isPending ? "Submitting Attempt" : "Submit"}
          </Button>
        ) : (
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            endContent={<FaArrowRight />}
            onPress={handleNext}
            isDisabled={
              !selectedAnswers[currentIndex] || saveAnsMutation.isPending
            }
            isLoading={saveAnsMutation.isPending}
          >
            {saveAnsMutation.isPending ? "Saving Answer" : "Next"}
          </Button>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center py-4">
        <Pagination
          radius="sm"
          page={currentIndex + 1}
          total={allQuestions.length}
          classNames={{
            cursor: "border-1 bg-transparent text-kidemia-primary",
            item: "bg-transparent shadow-none cursor-pointer",
          }}
          onChange={(page) => setCurrentIndex(page - 1)}
        />
      </div>
    </section>
  );
}
