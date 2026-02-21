import { useEffect, useMemo, useState, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import {
    Button,
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
    Image,
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
    FiMaximize,
    FiCamera,
    FiSearch,
    FiX,
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
    const hasSubmitted = useRef<boolean>(false);
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

    // Modals
    const { isOpen: isViolationOpen, onOpen: onViolationOpen, onOpenChange: onViolationChange } = useDisclosure();
    const { isOpen: isImageZoomOpen, onOpen: onImageZoomOpen, onOpenChange: onImageZoomChange } = useDisclosure();
    const [warningMessage, setWarningMessage] = useState("");

    // Data Fetching
    const { data: asstQuestions, isLoading } = useQuery<any>({
        queryKey: [QueryKeys.assessmentQuestions, assessment_id],
        queryFn: () => ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(assessment_id!, true),
        enabled: !!assessment_id,
    });

    const allQuestions = useMemo(() => asstQuestions?.questions || [], [asstQuestions]);
    const currentQuestion = allQuestions[currentIndex];

    // Mutations
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
            navigate(AssessmentRoutes.assessmentResult.replace(":assessment_id", assessment_id!), { replace: true });
        },
        onError: () => {
            setIsSubmitting(false);
            hasSubmitted.current = false;
        }
    });

    // Proctoring Logic
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

    useEffect(() => {
        if (asstQuestions?.detect_tab_switching && !hasSubmitted.current) {
            const handleVisibility = () => {
                if (document.hidden && !hasSubmitted.current) {
                    const nextCount = tabSwitchCount + 1;
                    setTabSwitchCount(nextCount);
                    handleViolation(`Tab switch detected (${nextCount}/${maxTabSwitches})`);
                    if (nextCount >= maxTabSwitches) submitAttemptMutation.mutate(attempt_id!);
                }
            };
            document.addEventListener("visibilitychange", handleVisibility);
            return () => document.removeEventListener("visibilitychange", handleVisibility);
        }
    }, [tabSwitchCount, asstQuestions]);

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
        onViolationOpen();
        if (attempt_id) {
            ApiSDK.AttemptsService.logProctoringViolationApiV1AttemptsAttemptsAttemptIdViolationPost(
                attempt_id, { violation_type: message, occurred_at: new Date().toISOString() }
            ).catch(console.error);
        }
    };

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

    const handleBack = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    if (isLoading || !currentQuestion) return <div className="h-screen flex items-center justify-center"><SpinnerCircle /></div>;
    if (isSubmitting || isTimeUp) return <LoadingSequence lines={[{ text: "Securing and submitting your responses...", className: "text-2xl font-bold" }]} />;

    const timeWarning = timeLeft <= 300;
    const isLastQuestion = currentIndex === allQuestions.length - 1;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono font-black text-lg transition-all duration-500 ${timeWarning ? "bg-red-500 text-white animate-pulse" : "bg-slate-900 text-white"}`}>
                            <FiClock className={timeWarning ? "animate-spin-slow" : ""} />
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                        <Chip variant="flat" color={webcamActive ? "success" : "danger"} size="sm" startContent={<FiCamera />}>Webcam</Chip>
                        <Chip variant="flat" color={isFullscreen ? "success" : "danger"} size="sm" startContent={<FiMaximize />}>Fullscreen</Chip>
                        <Chip variant="dot" color={tabSwitchCount >= maxTabSwitches ? "danger" : "warning"} size="sm">Switches: {tabSwitchCount}/{maxTabSwitches}</Chip>
                    </div>

                    <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                        className="font-bold rounded-xl"
                        onPress={() => submitAttemptMutation.mutate(attempt_id!)}
                    >
                        Finish
                    </Button>
                </div>
                <Progress
                    size="sm"
                    value={((currentIndex + 1) / allQuestions.length) * 100}
                    className="absolute bottom-0 w-full"
                    classNames={{ indicator: "bg-kidemia-secondary" }}
                />
            </header>

            <main className="flex-1 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 mb-24 lg:mb-0">

                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                        <CardBody className="p-0">
                            <div className="flex flex-col">
                                {/* INTERACTIVE IMAGE SECTION */}
                                {currentQuestion.image_url && (
                                    <div className="w-full bg-slate-50 border-b border-slate-100 p-6 flex flex-col items-center group relative cursor-zoom-in" onClick={onImageZoomOpen}>
                                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur p-2 rounded-full shadow-lg">
                                            <FiSearch className="text-kidemia-secondary" size={20} />
                                        </div>
                                        <Image
                                            src={currentQuestion.image_url}
                                            alt="Question illustration"
                                            className="max-h-[350px] w-auto object-contain rounded-2xl shadow-sm transition-transform group-hover:scale-[1.02]"
                                        />
                                        <p className="mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-kidemia-secondary transition-colors">Click image to enlarge</p>
                                    </div>
                                )}

                                <div className="p-6 md:p-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 bg-kidemia-secondary/10 text-kidemia-secondary text-xs font-black uppercase tracking-tighter rounded-full">
                                            Question {currentIndex + 1} of {allQuestions.length}
                                        </span>
                                    </div>

                                    <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight mb-8">
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
                                                className={`group relative flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedAnswers[currentIndex] === opt.id
                                                        ? "border-kidemia-secondary bg-blue-50/30 ring-1 ring-kidemia-secondary/20"
                                                        : "border-slate-100 hover:border-slate-200 bg-white"
                                                    }`}
                                            >
                                                <Radio value={opt.id} classNames={{ wrapper: "group-data-[selected=true]:border-kidemia-secondary group-data-[selected=true]:bg-kidemia-secondary" }}>
                                                    <span className="text-slate-700 font-semibold text-base md:text-lg ml-2">{opt.option_text}</span>
                                                </Radio>
                                                <span className="absolute right-6 text-slate-100 font-black text-3xl italic pointer-events-none group-hover:text-slate-200 transition-colors uppercase select-none">
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* NAVIGATION ACTIONS */}
                    <div className="hidden lg:flex items-center justify-between gap-4 py-4">
                        <Button variant="flat" size="lg" className="rounded-2xl font-bold px-8" onPress={handleBack} isDisabled={currentIndex === 0} startContent={<FiArrowLeft />}>Back</Button>

                        {!isLastQuestion ? (
                            <Button size="lg" className="bg-kidemia-secondary text-white rounded-2xl font-bold px-12 shadow-lg shadow-blue-200/50" onPress={handleNext} isLoading={saveAnsMutation.isPending} endContent={<FiArrowRight />}>
                                Next Question
                            </Button>
                        ) : (
                            <Button size="lg" color="success" className="text-white font-bold rounded-2xl px-12 shadow-lg shadow-green-200/50" startContent={<FiSend />} onPress={() => submitAttemptMutation.mutate(attempt_id!)} isLoading={submitAttemptMutation.isPending}>
                                Submit Final Result
                            </Button>
                        )}
                    </div>
                </div>

                {/* SIDEBAR */}
                <aside className="lg:col-span-4 space-y-6">
                    {asstQuestions?.require_webcam && (
                        <div className="relative aspect-video rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl border-4 border-white">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
                            <div className="absolute top-4 left-4">
                                <Chip size="sm" color="danger" className="animate-pulse bg-red-600 text-white font-bold">LIVE PROCTOR</Chip>
                            </div>
                        </div>
                    )}

                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem]">
                        <CardBody className="p-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex justify-between">
                                Question Map
                                <span className="text-kidemia-secondary">{Object.keys(selectedAnswers).length}/{allQuestions.length}</span>
                            </h4>
                            <div className="grid grid-cols-5 gap-3">
                                {allQuestions.map((_: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-11 rounded-xl font-bold transition-all ${currentIndex === idx ? "bg-kidemia-secondary text-white shadow-lg ring-4 ring-blue-50" :
                                                selectedAnswers[idx] ? "bg-green-500 text-white shadow-md shadow-green-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </aside>
            </main>

            {/* MOBILE NAVIGATION BAR */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-40 flex items-center gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
                <Button isIconOnly variant="flat" size="lg" className="rounded-2xl min-w-[64px]" onPress={handleBack} isDisabled={currentIndex === 0}><FiArrowLeft size={20} /></Button>
                {!isLastQuestion ? (
                    <Button fullWidth size="lg" className="bg-kidemia-secondary text-white rounded-2xl font-bold" onPress={handleNext} isLoading={saveAnsMutation.isPending} endContent={<FiArrowRight />}>Next</Button>
                ) : (
                    <Button fullWidth size="lg" color="success" className="text-white font-bold rounded-2xl" onPress={() => submitAttemptMutation.mutate(attempt_id!)} isLoading={submitAttemptMutation.isPending}>Submit</Button>
                )}
            </div>

            {/* IMAGE ZOOM MODAL */}
            <Modal isOpen={isImageZoomOpen} onOpenChange={onImageZoomChange} size="5xl" backdrop="blur" scrollBehavior="inside" closeButton={<Button isIconOnly variant="light" className="m-2 rounded-full"><FiX size={24} /></Button>}>
                <ModalContent className="bg-transparent shadow-none border-none">
                    <ModalBody className="p-0 flex justify-center items-center">
                        {currentQuestion.image_url && (
                            <Image
                                src={currentQuestion.image_url}
                                alt="Zoomed view"
                                className="max-h-[85vh] w-auto object-contain rounded-3xl"
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* SECURITY MODAL */}
            <Modal isOpen={isViolationOpen} onOpenChange={onViolationChange} isDismissable={false} backdrop="blur" hideCloseButton>
                <ModalContent className="rounded-[3rem] p-4">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col items-center gap-2 pt-8">
                                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2 animate-bounce">
                                    <FiAlertTriangle size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Security Alert</h3>
                            </ModalHeader>
                            <ModalBody className="text-center pb-8">
                                <p className="text-lg font-bold text-red-600 mb-2">{warningMessage}</p>
                                <p className="text-slate-500">Violations are logged and may result in automatic disqualification.</p>
                            </ModalBody>
                            <ModalFooter className="justify-center pb-8">
                                <Button className="px-12 h-14 font-black rounded-2xl bg-kidemia-secondary text-white shadow-xl shadow-blue-100" onPress={onClose}>Resume Test</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}