import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Button,
    Checkbox,
    Divider,
    Spinner,
    Chip,
} from "@heroui/react";
import {
    FiCheck,
    FiX,
    FiVideo,
    FiMaximize,
    FiWifi,
    FiClock,
    FiAlertCircle,
    FiShield,
    FiBookOpen,
    FiUser,
} from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { addToast } from "@heroui/react";
import { WardRoutes } from "../../routes";

export default function AssessmentPreparation() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    // Core States
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const [webcamCheckComplete, setWebcamCheckComplete] = useState(false); // NEW: Track if check is done
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasStableConnection, setHasStableConnection] = useState(true);
    const [userAcknowledged, setUserAcknowledged] = useState(false);

    const { data: configData, isLoading } = useQuery({
        queryKey: [QueryKeys.assessmentConfig, id],
        queryFn: () => ApiSDK.AssessmentsService.getAssessmentConfigApiV1AssessmentsAssessmentIdConfigGet(id!),
        enabled: !!id,
    });

    const config = configData?.data;

    const startAttemptMutation = useMutation({
        mutationFn: () => ApiSDK.AttemptsService.startTestAttemptApiV1AttemptsTestAssessmentIdStartPost(id!, {}),
        onSuccess: (data) => {
            addToast({ title: "Assessment Started", color: "success" });
            navigate(WardRoutes.questions.replace(":assessment_id", id!).replace(":attempt_id", data.attempt_id));
        },
    });

    // Webcam Logic - FIXED
    useEffect(() => {
        let stream: MediaStream | null = null;
        if (config?.requires_webcam) {
            navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
                .then((s) => {
                    stream = s;
                    setWebcamEnabled(true);
                    setWebcamCheckComplete(true); // Mark as complete
                    if (videoRef.current) videoRef.current.srcObject = s;
                })
                .catch(() => {
                    setWebcamEnabled(false);
                    setWebcamCheckComplete(true); // Mark as complete even on error
                });
        } else {
            // If webcam not required, mark as enabled and complete
            setWebcamEnabled(true);
            setWebcamCheckComplete(true);
        }
        return () => stream?.getTracks().forEach(track => track.stop());
    }, [config?.requires_webcam]);

    // Fullscreen Logic
    useEffect(() => {
        const checkFs = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", checkFs);
        return () => document.removeEventListener("fullscreenchange", checkFs);
    }, []);

    // Connection Logic
    useEffect(() => {
        const updateStatus = () => setHasStableConnection(navigator.onLine);
        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);
        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
        };
    }, []);

    // FIXED: Only check requirements that are actually enabled
    const allRequirementsMet =
        webcamCheckComplete && // Wait for webcam check to complete
        (!config?.requires_webcam || webcamEnabled) && // Only check webcam if required
        (!config?.requires_fullscreen || isFullscreen) && // Only check fullscreen if required
        hasStableConnection &&
        userAcknowledged;

    const attemptsRemaining = config ? config.max_attempts - config.attempts_used : 0;

    if (isLoading || !config) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Spinner size="lg" label="Initializing secure environment..." color="primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
            {/* Minimal Header */}
            <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-8 justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 bg-kidemia-primary rounded flex items-center justify-center text-white">C</div>
                    <span>Challenge</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1"><FiShield className="text-green-500" /> Secure Mode</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Center Content */}
                <div className="lg:col-span-8 space-y-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                            {config.assessment_title}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">Pre-assessment verification</p>
                    </div>

                    {/* Live Webcam Preview Section - ONLY SHOW IF REQUIRED */}
                    {config.requires_webcam && (
                        <div className="relative aspect-video max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            {webcamEnabled ? (
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 p-8 text-center">
                                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                                        <FiVideo size={32} />
                                    </div>
                                    <p className="font-bold text-xl">Camera access is blocked</p>
                                    <p className="text-slate-400 text-sm max-w-xs">Please allow camera permissions in your browser settings to proceed.</p>
                                </div>
                            )}
                            <div className="absolute bottom-6 left-6 flex gap-2">
                                <Chip variant="flat" color={webcamEnabled ? "success" : "danger"} className="bg-white/10 backdrop-blur text-white border-none">
                                    {webcamEnabled ? "Live Camera" : "Camera Offline"}
                                </Chip>
                            </div>
                        </div>
                    )}

                    {/* System Checks Grid - CONDITIONAL RENDERING */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {config.requires_webcam && (
                            <StatusCard
                                icon={<FiVideo />}
                                label="Video Feed"
                                status={webcamEnabled}
                                description={webcamEnabled ? "Verified" : "Action required"}
                            />
                        )}
                        <StatusCard
                            icon={<FiWifi />}
                            label="Connection"
                            status={hasStableConnection}
                            description={hasStableConnection ? "Strong" : "No internet"}
                        />
                        {config.requires_fullscreen && (
                            <StatusCard
                                icon={<FiMaximize />}
                                label="Fullscreen"
                                status={isFullscreen}
                                description={isFullscreen ? "Locked" : "Required"}
                                action={!isFullscreen && <Button size="sm" color="primary" variant="flat" onPress={() => document.documentElement.requestFullscreen()}>Enable</Button>}
                            />
                        )}
                        {/* FIXED: Only show if ANY proctoring feature is enabled */}
                        {(config.requires_webcam || config.requires_fullscreen || config.detect_tab_switching) && (
                            <StatusCard
                                icon={<FiUser />}
                                label="Proctoring"
                                status={true}
                                description="AI monitoring active"
                            />
                        )}
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2 italic">Special Instructions</h3>
                        <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {config.instructions || "No custom instructions provided."}
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
                            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">Assessment Details</h4>

                            <div className="space-y-5 mb-8">
                                <Stat icon={<FiClock />} label="Duration" value={`${config.duration_minutes} Minutes`} />
                                <Stat icon={<FiBookOpen />} label="Total Items" value={config.total_questions} />
                                <Stat icon={<FiCheck />} label="Passing Score" value={`${config.passing_percentage ?? 50}%`} />
                                <Stat icon={<FiAlertCircle />} label="Attempts Left" value={attemptsRemaining} highlight={attemptsRemaining <= 1} />
                            </div>

                            <Divider className="my-8" />

                            <div className="space-y-6">
                                <Checkbox isSelected={userAcknowledged} onValueChange={setUserAcknowledged} className="items-start">
                                    <span className="text-sm text-slate-500 font-medium leading-tight">
                                        I certify that I am the authorized user and agree to the terms
                                        {(config.requires_webcam || config.requires_fullscreen || config.detect_tab_switching) && " and proctoring"}.
                                    </span>
                                </Checkbox>

                                <Button
                                    size="lg"
                                    className={`w-full h-16 rounded-2xl font-bold text-lg transition-all ${allRequirementsMet ? "bg-kidemia-secondary text-white hover:scale-[1.02]" : "bg-slate-200 text-slate-400"
                                        }`}
                                    isDisabled={!allRequirementsMet || startAttemptMutation.isPending}
                                    isLoading={startAttemptMutation.isPending}
                                    onPress={() => startAttemptMutation.mutate()}
                                >
                                    Start Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-components for better readability
const StatusCard = ({ icon, label, status, description, action }: any) => (
    <div className={`p-5 rounded-2xl border transition-colors ${status ? "bg-white border-slate-200 shadow-sm" : "bg-red-50 border-red-100"}`}>
        <div className="flex justify-between items-start mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status ? "bg-blue-50 text-blue-600" : "bg-red-200 text-red-600"}`}>
                {icon}
            </div>
            {status ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
        </div>
        <div>
            <p className="font-bold text-slate-900">{label}</p>
            <p className={`text-xs font-medium ${status ? "text-slate-500" : "text-red-600"}`}>{description}</p>
        </div>
        {action && <div className="mt-3">{action}</div>}
    </div>
);

const Stat = ({ icon, label, value, highlight }: any) => (
    <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3 text-slate-400">
            {icon} <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className={`font-black ${highlight ? "text-red-500" : "text-slate-800"}`}>{value}</span>
    </div>
);