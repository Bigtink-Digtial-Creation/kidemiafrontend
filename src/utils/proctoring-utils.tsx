import { useEffect, useState } from "react";

/**
 * Hook to monitor tab visibility and track switches
 */
export function useTabSwitchMonitor(
    enabled: boolean,
    // maxSwitches: number,
    onViolation: (count: number) => void
) {
    const [switchCount, setSwitchCount] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setSwitchCount((prev) => {
                    const newCount = prev + 1;
                    onViolation(newCount);
                    return newCount;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [enabled, onViolation]);

    return switchCount;
}

/**
 * Hook to monitor fullscreen status
 */
export function useFullscreenMonitor(
    required: boolean,
    onExit: () => void
) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (!required) {
            setIsFullscreen(true);
            return;
        }

        const handleFullscreenChange = () => {
            const fullscreen = document.fullscreenElement !== null;
            setIsFullscreen(fullscreen);

            if (!fullscreen) {
                onExit();
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        setIsFullscreen(document.fullscreenElement !== null);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [required, onExit]);

    const enterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } catch (error) {
            console.error("Failed to enter fullscreen:", error);
        }
    };

    return { isFullscreen, enterFullscreen };
}

/**
 * Hook to monitor webcam status
 */
export function useWebcamMonitor(required: boolean) {
    const [isActive, setIsActive] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (!required) {
            setIsActive(true);
            return;
        }

        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((mediaStream) => {
                setStream(mediaStream);
                setIsActive(true);
            })
            .catch(() => {
                setIsActive(false);
            });

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [required]);

    return { isActive, stream };
}

/**
 * Hook for countdown timer with auto-submit
 */
export function useAssessmentTimer(
    durationMinutes: number,
    onTimeUp: () => void
) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, onTimeUp]);

    const pause = () => setIsActive(false);
    const resume = () => setIsActive(true);

    return {
        timeLeft,
        isWarning: timeLeft <= 300, // 5 minutes
        isCritical: timeLeft <= 60, // 1 minute
        pause,
        resume,
    };
}

/**
 * Format seconds to MM:SS display
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format date for assignment cards
 */
export function formatAssignmentDate(date: string | null): string {
    if (!date) return "No deadline";

    const d = new Date(date);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `Due in ${diffDays} days`;

    return `Due ${d.toLocaleDateString()}`;
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
    const colors = {
        assigned: "bg-blue-100 text-blue-700 border-blue-200",
        started: "bg-yellow-100 text-yellow-700 border-yellow-200",
        completed: "bg-green-100 text-green-700 border-green-200",
        overdue: "bg-red-100 text-red-700 border-red-200",
    };

    return colors[status as keyof typeof colors] || "bg-slate-100 text-slate-700 border-slate-200";
}

/**
 * Component: Proctoring Status Badge
 */
export function ProctoringStatusBadge({
    type,
    isActive,
}: {
    type: "webcam" | "fullscreen" | "tab-switching";
    isActive: boolean;
}) {
    const config = {
        webcam: {
            label: "Camera",
            activeClass: "bg-green-100 text-green-700 border-green-300",
            inactiveClass: "bg-red-100 text-red-700 border-red-300",
        },
        fullscreen: {
            label: "Fullscreen",
            activeClass: "bg-green-100 text-green-700 border-green-300",
            inactiveClass: "bg-red-100 text-red-700 border-red-300",
        },
        "tab-switching": {
            label: "Tab Monitor",
            activeClass: "bg-green-100 text-green-700 border-green-300",
            inactiveClass: "bg-orange-100 text-orange-700 border-orange-300",
        },
    };

    const { label, activeClass, inactiveClass } = config[type];

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${isActive ? activeClass : inactiveClass
                }`}
        >
            {label}: {isActive ? "Active" : "Inactive"}
        </span>
    );
}

/**
 * Component: Timer Display
 */
export function TimerDisplay({ seconds }: { seconds: number }) {
    const isWarning = seconds <= 300;
    const isCritical = seconds <= 60;

    return (
        <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg transition-all ${isCritical
                ? "bg-red-100 text-red-700 animate-pulse"
                : isWarning
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>{formatTime(seconds)}</span>
        </div>
    );
}

/**
 * Validate assessment requirements before starting
 */
export function validateAssessmentRequirements(config: {
    requires_webcam: boolean;
    requires_fullscreen: boolean;
    webcamActive: boolean;
    isFullscreen: boolean;
    hasConnection: boolean;
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.requires_webcam && !config.webcamActive) {
        errors.push("Camera access is required");
    }

    if (config.requires_fullscreen && !config.isFullscreen) {
        errors.push("Fullscreen mode is required");
    }

    if (!config.hasConnection) {
        errors.push("Internet connection is required");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}