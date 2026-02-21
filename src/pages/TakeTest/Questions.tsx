import { useEffect, useMemo, useRef, useState } from "react";
import {
  addToast,
  Button,
  Pagination,
  Radio,
  RadioGroup,
  Card,
  CardBody,
  Progress,
  Image,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiAlertCircle
} from "react-icons/fi";
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

  // Modal Control
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
          { text: "Loading your questions...", className: "text-lg font-medium" },
          { text: "Preparing your exam environment..." },
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
              : "Finalizing your assessment...",
            className: "text-2xl font-bold text-kidemia-secondary",
          },
          {
            text: "Please do not close or refresh this page. Securing your results.",
          },
        ]}
      />
    );
  }

  const progressValue = ((currentIndex + 1) / allQuestions.length) * 100;
  const isTimeCritical = timeLeft < 300; // Less than 5 mins
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50/50 w-full flex flex-col items-center">
      {/* Sticky Header with Timer and Progress */}
      <header className="sticky top-0 z-20 w-full bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1 max-w-[200px] md:max-w-xs">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
              <span>Progress</span>
              <span>{currentIndex + 1} / {allQuestions.length}</span>
            </div>
            <Progress
              value={progressValue}
              size="sm"
              className="h-2"
              color={isTimeCritical ? "warning" : "primary"}
              classNames={{ indicator: "bg-kidemia-secondary" }}
            />
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-colors ${isTimeCritical ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-slate-100 border-transparent text-slate-700"
            }`}>
            <FiClock className={isTimeCritical ? "text-red-500" : "text-slate-500"} />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>

          <Button
            size="sm"
            color="danger"
            variant="flat"
            className="font-bold hidden sm:flex"
            onPress={onOpen}
          >
            Finish Early
          </Button>
        </div>
      </header>

      <main className="w-full max-w-6xl px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Question Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-none rounded-[1.5rem] overflow-hidden">
            <CardBody className="p-0">
              <div className="bg-white p-6 md:p-10">
                {/* Question Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-kidemia-secondary/10 text-kidemia-secondary text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                    Question {currentIndex + 1}
                  </span>
                  <Divider className="flex-1" />
                  <span className="text-slate-400 text-xs font-medium italic hidden md:block">
                    {currentQuestion.topic_name}
                  </span>
                </div>

                {/* Main Content Area: Text + Image Handling */}
                <div className={`grid grid-cols-1 gap-8 ${currentQuestion.image_url ? "md:grid-cols-2" : "md:grid-cols-1"}`}>

                  {/* Image Display */}
                  {currentQuestion.image_url && (
                    <div className="order-1 md:order-2 flex flex-col gap-2">
                      <Image
                        src={currentQuestion.image_url}
                        alt="Question Visual Aid"
                        className="w-full object-cover rounded-2xl shadow-md"
                        fallbackSrc="https://via.placeholder.com/400x300?text=Image+Not+Found"
                      />
                      <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                        <FiInfo /> Visual aid for this question
                      </p>
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="order-2 md:order-1 space-y-8">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                      {currentQuestion.question_text}
                    </h2>

                    <RadioGroup
                      value={selectedAnswers[currentIndex] || ""}
                      onValueChange={handleAnswerSelect}
                      className="gap-4"
                    >
                      {currentQuestion.options.map((option: any, idx: number) => (
                        <div
                          key={option.id}
                          className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer group hover:bg-slate-50 ${selectedAnswers[currentIndex] === option.id
                            ? "border-kidemia-secondary bg-blue-50/30 ring-2 ring-kidemia-secondary/20"
                            : "border-slate-100"
                            }`}
                          onClick={() => handleAnswerSelect(option.id)}
                        >
                          <Radio value={option.id} />
                          <div className="flex flex-1 justify-between items-center ml-2">
                            <span className={`text-base md:text-lg font-medium ${selectedAnswers[currentIndex] === option.id ? "text-kidemia-secondary" : "text-slate-700"
                              }`}>
                              {option.option_text}
                            </span>
                            <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-400 uppercase tracking-widest ml-4">
                              Option {String.fromCharCode(65 + idx)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
                <Button
                  onPress={handlePrev}
                  isDisabled={currentIndex === 0}
                  variant="flat"
                  className="rounded-xl font-bold"
                  startContent={<FiArrowLeft />}
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentIndex === allQuestions.length - 1 ? (
                    <Button
                      onPress={onOpen}
                      isDisabled={!selectedAnswers[currentIndex]}
                      color="success"
                      className="bg-green-600 text-white font-bold rounded-xl px-8 shadow-lg shadow-green-100"
                      startContent={<FiCheckCircle />}
                    >
                      Finish Test
                    </Button>
                  ) : (
                    <Button
                      onPress={handleNext}
                      isDisabled={!selectedAnswers[currentIndex]}
                      color="primary"
                      className="bg-kidemia-secondary text-white font-bold rounded-xl px-10 shadow-lg shadow-blue-100"
                      endContent={<FiArrowRight />}
                      isLoading={saveAnsMutation.isPending}
                    >
                      Save & Next
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Question Navigator (Sidebar) */}
        <aside className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-[1.5rem]">
            <CardBody className="p-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                Question Navigator
              </h3>
              <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2">
                {allQuestions.map((_: any, idx: number) => {
                  const isAnswered = !!selectedAnswers[idx];
                  const isCurrent = currentIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border-2 ${isCurrent
                        ? "bg-kidemia-secondary border-kidemia-secondary text-white scale-110 shadow-md z-10"
                        : isAnswered
                          ? "bg-green-50 border-green-100 text-green-600"
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                        }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <div className="w-3 h-3 rounded bg-green-500" /> Answered
                  <div className="w-3 h-3 rounded bg-white border border-slate-300" /> Unanswered
                </div>
                <Divider />
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Your progress is saved automatically every time you click <b>Next</b>.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="lg:hidden w-full pb-10 flex justify-center">
            <Pagination
              page={currentIndex + 1}
              total={allQuestions.length}
              onChange={(page) => setCurrentIndex(page - 1)}
              classNames={{
                cursor: "bg-kidemia-secondary text-white",
              }}
            />
          </div>
        </aside>
      </main>

      {/* SUBMISSION MODAL */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        className="mx-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                <div className="bg-warning-50 text-warning p-4 rounded-full mb-2">
                  <FiAlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold">Submit Assessment?</h3>
              </ModalHeader>
              <ModalBody className="text-center pb-6">
                <p className="text-slate-600">
                  You have answered <strong>{answeredCount}</strong> out of <strong>{allQuestions.length}</strong> questions.
                </p>
                {answeredCount < allQuestions.length && (
                  <p className="text-danger font-medium mt-2">
                    Warning: You still have unanswered questions!
                  </p>
                )}
                <p className="text-sm text-slate-400 mt-4 italic">
                  Once submitted, you will not be able to change your answers.
                </p>
              </ModalBody>
              <ModalFooter className="flex-col sm:flex-row gap-3">
                <Button
                  variant="light"
                  fullWidth
                  onPress={onClose}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  fullWidth
                  onPress={() => {
                    onClose();
                    safeSubmit();
                  }}
                  className="bg-kidemia-secondary text-white font-bold"
                >
                  Yes, Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}