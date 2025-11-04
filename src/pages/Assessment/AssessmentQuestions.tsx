/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import {
  addToast,
  Button,
  Pagination,
  Radio,
  RadioGroup,
  Spinner,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import { selectedAssesmentAnswersAtom } from "../../store/test.atom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { SaveAnswerRequest } from "../../sdk/generated";
import { apiErrorParser } from "../../utils/errorParser";
import InstructionCard from "./InstructionCard";

type OptionT = string;

export default function AssessmentQuestions() {
  const { assessment_id, attempt_id } = useParams<{
    assessment_id: string;
    attempt_id: string;
  }>();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useAtom(
    selectedAssesmentAnswersAtom,
  );

  // console.log("Assessment ID:", assessment_id);
  // console.log("Attempt ID:", attempt_id);

  const { data: asstQuestions, isLoading } = useQuery<any>({
    queryKey: [QueryKeys.assessmentQuestions, assessment_id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        assessment_id!,
        true,
      ),
    enabled: !!assessment_id,
  });

  console.log(asstQuestions?.questions);

  const allQuestions = useMemo(() => {
    if (!asstQuestions?.questions) return [];
    return asstQuestions.questions.map((q: any) => ({
      ...q,
      assessmentTitle: asstQuestions.title,
    }));
  }, [asstQuestions]);

  const currentQuestion = allQuestions[currentIndex];

  const handleOptionSelect = (value: OptionT) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  // mutation
  // const saveAnsMutation = useMutation({
  //   mutationFn: ({ attempt_id, requestBody }: {
  //     attempt_id: string;
  //     requestBody: SaveAnswerRequest;
  //   }) => ApiSDK.AttemptsService.saveAnswerApiV1AttemptsAttemptIdAnswerPost(attempt_id, requestBody),
  //   onSuccess(data) {
  //     console.log({ data });

  //   },
  //   onError(error) {
  //     console.log(error);

  //   }
  // })
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
      console.log("✅ Answer submitted successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Failed to submit answer:", error);
    },
  });

  // const handleNext = () => {
  //   const selectedOptionId = selectedAnswers[currentIndex];
  //   const questionId = currentQuestion?.id;
  //   //Send user’s selected answer for this question
  //   if (attempt_id && questionId && selectedOptionId) {
  //     saveAnsMutation.mutate({
  //       attempt_id,
  //       requestBody: {
  //         question_id: questionId,
  //         selected_option_ids: [selectedOptionId],
  //       },
  //     });
  //   }
  //   // Then move to next question
  //   if (currentIndex < allQuestions.length - 1) {
  //     setCurrentIndex((prev) => prev + 1)
  //   }
  // }

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

  // const submitAttemptMutation = useMutation({
  //   mutationFn: (attemptId: string) => ApiSDK.AttemptsService.submitAttemptApiV1AttemptsAttemptIdSubmitPost(attemptId)
  // })

  // const onSubmit = (attemptId: string) => {
  //   submitAttemptMutation.mutate(attemptId)
  // }

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

  return (
    <section className="space-y-6 md:px-12 w-full max-w-4xl pb-24-">
      <InstructionCard
        title={asstQuestions.title}
        code={asstQuestions.code}
        exam_session={asstQuestions.exam_session}
        exam_year={asstQuestions.exam_year}
        assessment_type={asstQuestions.assessment_type}
        category={asstQuestions.category}
        description={asstQuestions.description}
        instructions={asstQuestions.instructions}
      />

      <div className="py-4 px-6">
        <div className="space-y-3">
          <h2 className="text-xl text-kidemia-black font-semibold">
            Question {currentIndex + 1}
          </h2>
          <p className="text-lg text-kidemia-grey font-medium">
            {currentQuestion.question_text}
          </p>
        </div>

        <div className="py-4">
          <RadioGroup
            value={selectedAnswers[currentIndex] || ""}
            onValueChange={handleOptionSelect}
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
            // onPress={handleSubmit}
            isDisabled={!selectedAnswers[currentIndex]}
          >
            Submit
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
            Next
          </Button>
        )}
      </div>

      <div className="flex justify-center items-center py-2">
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
