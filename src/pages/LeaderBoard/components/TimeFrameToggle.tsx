interface TimeFrameToggleProps {
    timeFrame: string;
    setTimeFrame: (frame: string) => void;
}

interface TimeFrame {
    key: string;
    label: string;
}
export const TimeFrameToggle = ({ timeFrame, setTimeFrame }: TimeFrameToggleProps) => {
    const frames: TimeFrame[] = [
        { key: "week", label: "This Week" },
        { key: "month", label: "This Month" },
        { key: "allTime", label: "All Time" },
    ];

    // const selectedFrame = frames.find((f) => f.key === timeFrame);

    return (
        <>
            <div className="flex gap-1.5 bg-white/60 backdrop-blur-xl rounded-full p-1 border border-gray-200/50">
                {frames.map((tf) => (
                    <button
                        key={tf.key}
                        onClick={() => setTimeFrame(tf.key)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${timeFrame === tf.key
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                            }`}
                    >
                        {tf.label}
                    </button>
                ))}
            </div>
        </>
    );
};