import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { ApiSDK } from "../../sdk";
import type { AttemptSummaryResponse, SingleAnswerCorrectionResponse } from "../../sdk/generated";
import SpinnerCircle from "../../components/Spinner/Circle";
import getYouTubeEmbedUrl from "../../components/YouTube/EmbedUrl";
import CorrectionHeader from "./components/CorrectionHeader";
import QuestionCard from "./components/QuestionCard";
import MediaBlock from "./components/MediaBlock";
import QuestionNumberGrid from "./components/QuestionNumberGrid";

export function CorrectionPage() {
    const { attemptId } = useParams<{ attemptId: string }>();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["attempt-correction", attemptId],
        queryFn: () => ApiSDK.AttemptsService.getCorrectionApiV1AttemptsAttemptIdCorrectionGet(attemptId!),
        enabled: !!attemptId,
    });

    const answers: SingleAnswerCorrectionResponse[] = (data?.answers || []);
    const attempt: AttemptSummaryResponse | undefined = data?.attempt;

    const storageKey = `kidemia:correction:${attemptId}:lastIndex`;
    const [currentIndex, setCurrentIndex] = useState<number>(() => {
        try {
            const v = localStorage.getItem(storageKey);
            return v ? parseInt(v, 10) : 0;
        } catch { return 0; }
    });

    // persist
    useEffect(() => {
        try { localStorage.setItem(storageKey, String(currentIndex)); } catch { }
    }, [currentIndex, storageKey]);

    // keyboard navigation
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowRight") setCurrentIndex(i => Math.min(i + 1, answers.length - 1));
            if (e.key === "ArrowLeft") setCurrentIndex(i => Math.max(i - 1, 0));
            if (/^[0-9]$/.test(e.key)) {
                const n = Number(e.key);
                if (n > 0 && n <= answers.length) setCurrentIndex(n - 1);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [answers.length]);

    // swipe handlers (mobile)
    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentIndex(i => Math.min(i + 1, answers.length - 1)),
        onSwipedRight: () => setCurrentIndex(i => Math.max(i - 1, 0)),
        trackMouse: true,
    });

    const goTo = useCallback((n: number) => setCurrentIndex(Math.max(0, Math.min(n, answers.length - 1))), [answers.length]);

    // Early returns AFTER all hooks
    if (isLoading) return (
        <div className="min-h-screen bg-kidemia-white flex flex-col items-center justify-center space-y-4">
            <SpinnerCircle />
            <p className="text-lg md:text-xl text-kidemia-primary text-center">
                Hang tight! We're carefully reviewing your answers...
            </p>
            <p className="text-sm text-kidemia-gray-400 text-center">
                This may take a few seconds. Good things come to those who wait 😉
            </p>
        </div>
    );

    if (isError || !data) return (
        <div className="min-h-screen bg-kidemia-primary flex items-center justify-center">
            <p className="text-red-200">{(error as any)?.message || "Failed to load"}</p>
        </div>
    );

    const currentAnswer = answers[currentIndex];
    const failed = !currentAnswer.result.is_correct;
    const videoUrl = currentAnswer.question.video_url;
    const youtubeEmbedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

    return (
        <div className="min-h-screen bg-kidemia-primary">
            <CorrectionHeader attempt={attempt!} />

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
                {/* LEFT: Full height question section - no margin on desktop */}
                <div className="lg:w-1/2 bg-kidemia-white flex flex-col p-6 lg:py-8 lg:px-0 lg:pr-8">
                    <div className="flex-1 lg:pl-8 flex flex-col">
                        <div {...handlers} className="flex-1 mb-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentAnswer.answer_id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <QuestionCard answer={currentAnswer} index={currentIndex} />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation buttons */}
                        <div className="mb-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => goTo(currentIndex - 1)}
                                    disabled={currentIndex === 0}
                                    className="px-6 py-3 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={() => goTo(currentIndex + 1)}
                                    disabled={currentIndex === answers.length - 1}
                                    className="px-6 py-3 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>

                        {/* Question number grid */}
                        <div className="pb-6">
                            <QuestionNumberGrid answers={answers} currentIndex={currentIndex} onChange={goTo} />
                        </div>
                    </div>
                </div>

                <aside className="lg:w-1/2 p-6 lg:p-8 space-y-6 overflow-y-auto bg-kidemia-primary">
                    <div>
                        <h2 className="text-md font-bold text-white ">
                            {failed ? 'You Failed this question' : 'You Passed this question'}
                        </h2>
                    </div>

                    <div className="bg-kidemia-white rounded-2xl p-6 shadow-sm space-y-4">
                        {currentAnswer.question.image_url && (
                            <MediaBlock question={currentAnswer.question} />
                        )}

                        {currentAnswer.question.explanation && (
                            <div>
                                <p className="text-gray-800 leading-relaxed">
                                    {currentAnswer.question.explanation}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Video card */}
                    {videoUrl && (
                        <div className="bg-kidemia-white rounded-2xl overflow-hidden shadow-sm">
                            {youtubeEmbedUrl ? (
                                <div className="relative pb-[56.25%]">
                                    <iframe
                                        src={youtubeEmbedUrl}
                                        className="absolute top-0 left-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Explanation video"
                                    />
                                </div>
                            ) : (
                                <video controls className="w-full">
                                    <source src={videoUrl} />
                                </video>
                            )}

                            <div className="p-4 flex items-center justify-between bg-gray-50">
                                <span className="text-sm text-gray-700 font-medium">Watch the video to know more</span>
                                <svg className="w-6 h-6 text-kidemia-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

export default CorrectionPage;