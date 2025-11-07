/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useAtom, useAtomValue } from "jotai";
import { selectedAnswersAtom, selectedTopicsAtom } from "../../store/test.atom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useNavigate, useParams } from "react-router";
import { SidebarRoutes, TestRoutes } from "../../routes";
import { formatTime } from "../../utils";
import type { SaveAnswerRequest } from "../../sdk/generated";
// import type { AutoAssessmentRequest } from "../../sdk/generated";

type AnswerOption = string;

export default function QuestionsPage() {
  const { assessment_id, attempt_id } = useParams<{
    assessment_id: string
    attempt_id: string;
  }>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useAtom(selectedAnswersAtom);
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60);

  const selectedTopics = useAtomValue(selectedTopicsAtom);
  const topicIds = selectedTopics.map((topic) => topic.id);

  console.log({ topicIds });


  const navigate = useNavigate();

  // const { data: questionsData, isLoading } = useQuery({
  //   queryKey: [QueryKeys.allQuestions, topicIds],
  //   queryFn: () =>
  //     ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost(
  //       topicIds,
  //     ),
  //   enabled: topicIds.length > 0,
  // });


  const { data: questionsData, isLoading } = useQuery<any>({
    queryKey: [QueryKeys.allQuestions, assessment_id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        assessment_id!,
        true,
      ),
    enabled: !!assessment_id,

  })

  // console.log({ testQuestions });


  // flatten and memoize questions for easy navigations
  const allQuestions = useMemo(() => {
    if (!questionsData?.questions) return [];
    return questionsData.questions.map((q: any) => ({
      ...q,
      topicTitle: questionsData.title
    }))
    // return questionsData.questions.map((q: any) =>
    //   topic.questions.map((q: any) => ({
    //     ...q,
    //     topic_name: topic.topic_name,
    //   })),
    // );
  }, [questionsData]);

  const currentQuestion = allQuestions[currentIndex];

  //Start countdown once questions finish loading
  useEffect(() => {
    if (!isLoading && allQuestions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            addToast({
              title: "Attention",
              description: "Test time is over!",
              color: "danger",
            });
            navigate(SidebarRoutes.dashboard);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, allQuestions.length, navigate]);


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

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    navigate(TestRoutes.review);
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
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
            {currentQuestion.options.map((option: any, idx: number) => (
              <Radio
                key={idx}
                value={option.option_text}
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
            onPress={handleSubmit}
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
            isDisabled={!selectedAnswers[currentIndex]}
          >
            Next
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
