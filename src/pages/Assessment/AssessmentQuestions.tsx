import { useEffect, useMemo, useState, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import {
    Button,
    Pagination,
    Radio,
    RadioGroup,
    Chip,
    Progress,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Card,
    CardBody,
} from "@heroui/react";
import {
    attemptResultAtom,
    selectedAssesmentAnswersAtom,
} from "../../store/test.atom";
import {
    FiArrowLeft,
    FiArrowRight,
    FiAlertTriangle,
    FiClock,
    FiSend,
} from "react-icons/fi";
import type { SaveAnswerRequest } from "../../sdk/generated";
import { formatTime } from "../../utils";
import SpinnerCircle from "../../components/Spinner/Circle";
import LoadingSequence from "../../components/Loading/LoadingSequence";
import { AssessmentRoutes } from "../../routes";

export default function AssessmentQuestions() {
    const resetAns = useResetAtom(selectedAssesmentAnswersAtom);
    const setAttemptResult = useSetAtom(attemptResultAtom);
    const { assessment_id, attempt_id } = useParams<{ assessment_id: string; attempt_id: string }>();
    const navigate = useNavigate();

    // Refs & State
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasSubmitted = useRef<boolean>(false); // Guards against multiple submission calls
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [selectedAnswers, setSelectedAnswers] = useAtom(selectedAssesmentAnswersAtom);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Proctoring State
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [webcamActive, setWebcamActive] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(true);
    const [maxTabSwitches, setMaxTabSwitches] = useState(3);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [warningMessage, setWarningMessage] = useState("");

    // Data Fetching
    const { data: asstQuestions, isLoading } = useQuery<any>({
        queryKey: [QueryKeys.assessmentQuestions, assessment_id],
        queryFn: () => ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(assessment_id!, true),
        enabled: !!assessment_id,
    });

    const allQuestions = useMemo(() => {
        if (!asstQuestions?.questions) return [];
        return asstQuestions.questions;
    }, [asstQuestions]);

    const currentQuestion = allQuestions[currentIndex];

    // --- MUTATIONS ---

    const saveAnsMutation = useMutation({
        mutationFn: (body: SaveAnswerRequest) =>
            ApiSDK.AttemptsService.saveAnswerApiV1AttemptsAttemptIdAnswerPost(attempt_id!, body)
    });

    const submitAttemptMutation = useMutation({
        mutationFn: (id: string) => ApiSDK.AttemptsService.submitAttemptApiV1AttemptsAttemptIdSubmitPost(id),
        onMutate: () => {
            setIsSubmitting(true);
            hasSubmitted.current = true;
        },
        onSuccess: (data) => {
            setAttemptResult(data);
            resetAns();
            // Using replace: true prevents the user from going back to the test
            navigate(AssessmentRoutes.assessmentResult.replace(":assessment_id", assessment_id!), { replace: true });
        },
        onError: () => {
            setIsSubmitting(false);
            hasSubmitted.current = false;
        }
    });

    // Webcam Initialization
    useEffect(() => {
        if (asstQuestions?.require_webcam && !hasSubmitted.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setWebcamActive(true);
                    }
                })
                .catch(() => {
                    setWebcamActive(false);
                    handleViolation("Webcam access lost or denied");
                });
        }
    }, [asstQuestions]);

    // Tab Switching
    useEffect(() => {
        if (asstQuestions?.detect_tab_switching && !hasSubmitted.current) {
            const handleVisibility = () => {
                if (document.hidden && !hasSubmitted.current) {
                    const nextCount = tabSwitchCount + 1;
                    setTabSwitchCount(nextCount);
                    handleViolation(`Tab switch detected (${nextCount}/${maxTabSwitches})`);
                    if (nextCount >= maxTabSwitches) {
                        submitAttemptMutation.mutate(attempt_id!);
                    }
                }
            };
            document.addEventListener("visibilitychange", handleVisibility);
            return () => document.removeEventListener("visibilitychange", handleVisibility);
        }
    }, [tabSwitchCount, asstQuestions]);

    // Fullscreen Monitor
    useEffect(() => {
        if (asstQuestions?.fullscreen_required && !hasSubmitted.current) {
            const handleFs = () => {
                const isFs = !!document.fullscreenElement;
                setIsFullscreen(isFs);
                if (!isFs && !hasSubmitted.current) handleViolation("Fullscreen mode exited");
            };
            document.addEventListener("fullscreenchange", handleFs);
            return () => document.removeEventListener("fullscreenchange", handleFs);
        }
    }, [asstQuestions]);

    const handleViolation = (message: string) => {
        if (hasSubmitted.current) return;
        setWarningMessage(message);
        onOpen();
        if (attempt_id) {
            ApiSDK.AttemptsService.logProctoringViolationApiV1AttemptsAttemptsAttemptIdViolationPost(
                attempt_id, { violation_type: message, occurred_at: new Date().toISOString() }
            ).catch(console.error);
        }
    };

    // Timer - Logic check added
    useEffect(() => {
        if (!isLoading && asstQuestions?.duration_minutes && !hasSubmitted.current) {
            setTimeLeft(asstQuestions.duration_minutes * 60);
            setMaxTabSwitches(asstQuestions.max_tab_switches || 3);

            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        if (!hasSubmitted.current) {
                            setIsTimeUp(true);
                            submitAttemptMutation.mutate(attempt_id!);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isLoading, asstQuestions?.duration_minutes]);

    const handleNext = async () => {
        if (selectedAnswers[currentIndex]) {
            await saveAnsMutation.mutateAsync({
                question_id: currentQuestion.id,
                selected_option_ids: [selectedAnswers[currentIndex]],
            });
        }
        if (currentIndex < allQuestions.length - 1) setCurrentIndex(prev => prev + 1);
    };

    if (isLoading || !currentQuestion) return <div className="h-screen flex items-center justify-center"><SpinnerCircle /></div>;

    if (isSubmitting || isTimeUp) return <LoadingSequence lines={[{ text: "Securing and submitting your responses...", className: "text-2xl font-bold" }]} />;

    const timeWarning = timeLeft <= 300;
    const isLastQuestion = currentIndex === allQuestions.length - 1;

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-lg shadow-inner transition-colors ${timeWarning ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-100 text-slate-700"}`}>
                            <FiClock /> {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Chip variant="dot" color={webcamActive ? "success" : "danger"}>Webcam</Chip>
                        <Chip variant="dot" color={isFullscreen ? "success" : "danger"}>Fullscreen</Chip>
                        <Chip variant="flat" color={tabSwitchCount > 1 ? "warning" : "default"}>Switches: {tabSwitchCount}/{maxTabSwitches}</Chip>
                    </div>

                    <Button
                        color="danger"
                        variant="ghost"
                        size="sm"
                        className="font-bold border-2"
                        onPress={() => submitAttemptMutation.mutate(attempt_id!)}
                    >
                        Finish Early
                    </Button>
                </div>
                <Progress
                    size="sm"
                    value={((currentIndex + 1) / allQuestions.length) * 100}
                    className="absolute bottom-0 left-0 w-full"
                    color={timeWarning ? "danger" : "primary"}
                />
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8">

                <div className="lg:col-span-8 space-y-6">
                    <Card className="shadow-sm border-none rounded-[2rem] overflow-hidden">
                        <CardBody className="p-6 md:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-xs font-black uppercase tracking-widest text-white bg-kidemia-secondary px-3 py-1 rounded-lg">
                                    Question {currentIndex + 1}
                                </span>
                            </div>

                            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-snug mb-10">
                                {currentQuestion.question_text}
                            </h2>

                            <RadioGroup
                                value={selectedAnswers[currentIndex] || ""}
                                onValueChange={(val) => setSelectedAnswers({ ...selectedAnswers, [currentIndex]: val })}
                                className="gap-4"
                            >
                                {currentQuestion.options.map((opt: any, i: number) => (
                                    <div
                                        key={opt.id}
                                        className={`group relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedAnswers[currentIndex] === opt.id
                                            ? "border-kidemia-secondary bg-blue-50/50 shadow-md shadow-kidemia-secondary/50"
                                            : "border-slate-100 hover:border-slate-300 bg-white"
                                            }`}
                                    >
                                        <Radio value={opt.id} className="mr-2">
                                            <span className="text-slate-700 font-medium md:text-lg pl-2">{opt.option_text}</span>
                                        </Radio>
                                        <span className="absolute right-4 text-slate-300 font-black group-hover:text-slate-400 transition-colors uppercase">
                                            Option {String.fromCharCode(65 + i)}
                                        </span>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardBody>
                    </Card>

                    <div className="flex lg:hidden items-center justify-between gap-4 mt-4">
                        <Button isIconOnly variant="flat" className="bg-kidemia-secondary text-white" onPress={() => setCurrentIndex(c => c - 1)} isDisabled={currentIndex === 0}><FiArrowLeft /></Button>

                        {!isLastQuestion ? (
                            <>
                                <Pagination total={allQuestions.length} page={currentIndex + 1} onChange={(p) => setCurrentIndex(p - 1)} size="sm" />
                                <Button isIconOnly color="primary" className="bg-kidemia-secondary text-white" onPress={handleNext} isLoading={saveAnsMutation.isPending}><FiArrowRight /></Button>
                            </>
                        ) : (
                            <Button
                                color="success"
                                className="flex-1 text-white font-bold h-10 rounded-xl"
                                startContent={<FiSend />}
                                onPress={() => submitAttemptMutation.mutate(attempt_id!)}
                                isLoading={submitAttemptMutation.isPending}
                            >
                                Submit Final
                            </Button>
                        )}
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-6">
                    {asstQuestions?.require_webcam && (
                        <div className="relative aspect-video rounded-[2rem] bg-slate-900 overflow-hidden shadow-xl border-4 border-white">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
                            <div className="absolute top-3 left-3">
                                <Chip size="sm" color="danger" className="animate-pulse bg-red-600 text-white border-none">LIVE PROCTOR</Chip>
                            </div>
                        </div>
                    )}

                    <Card className="hidden lg:block border-none shadow-sm rounded-[2rem]">
                        <CardBody className="p-6">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Question Map</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {allQuestions.map((_: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-10 rounded-xl font-bold transition-all ${currentIndex === idx
                                            ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-200"
                                            : selectedAnswers[idx]
                                                ? "bg-green-100 text-green-600"
                                                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 space-y-3">
                                <Button
                                    fullWidth
                                    size="lg"
                                    color="primary"
                                    className="font-bold rounded-2xl bg-kidemia-secondary text-white"
                                    onPress={handleNext}
                                    isDisabled={isLastQuestion}
                                    isLoading={saveAnsMutation.isPending}
                                >
                                    Next Question
                                </Button>
                                {isLastQuestion && (
                                    <Button
                                        fullWidth
                                        size="lg"
                                        color="success"
                                        className="text-white font-bold rounded-2xl shadow-lg shadow-green-100"
                                        startContent={<FiSend />}
                                        onPress={() => submitAttemptMutation.mutate(attempt_id!)}
                                        isLoading={submitAttemptMutation.isPending}
                                    >
                                        Submit Final
                                    </Button>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </aside>
            </main>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur">
                <ModalContent className="rounded-[2.5rem] p-4">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                                    <FiAlertTriangle size={32} />
                                </div>
                                <span className="text-2xl font-bold">Security Violation</span>
                            </ModalHeader>
                            <ModalBody className="text-center text-slate-600">
                                <p className="font-semibold text-slate-900">{warningMessage}</p>
                                <p className="text-sm">Multiple violations will result in immediate disqualification and auto-submission of your test.</p>
                            </ModalBody>
                            <ModalFooter className="justify-center pb-6">
                                <Button color="primary" className="px-10 font-bold rounded-xl bg-kidemia-secondary text-white" onPress={onClose}>
                                    I Understand
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}