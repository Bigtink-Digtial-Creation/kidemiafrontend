import { useState, useEffect, useRef } from "react";
import { Award, Flame, TrendingUp, Trophy } from "lucide-react";
import type { LeaderboardEntryResponse } from "../../../sdk/generated";

const getBadgeColorClass = (rarity: string): string => {
    const rarityColors: Record<string, string> = {
        common: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        rare: "bg-blue-50 text-blue-700 border border-blue-200",
        epic: "bg-purple-50 text-purple-700 border border-purple-200",
        legendary: "bg-amber-50 text-amber-700 border border-amber-200",
    };
    return rarityColors[rarity] || rarityColors.common;
};

interface RankListProps {
    students: LeaderboardEntryResponse[];
    currentUserId?: string;
}
const BATCH_SIZE = 10;

export const RankList = ({ students, currentUserId }: RankListProps) => {
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    // Reset visible count if the students array changes (e.g., filtered or refreshed)
    useEffect(() => {
        setVisibleCount(BATCH_SIZE);
    }, [students]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && visibleCount < students.length) {
                    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, students.length));
                }
            },
            {
                rootMargin: "200px",
                threshold: 0.1
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [visibleCount, students.length]);

    const visibleStudents = students.slice(0, visibleCount);

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-200/50 overflow-hidden">
            <div className="p-4 md:p-5 border-b border-gray-200/50">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-kidemia-primary" />
                    Full Rankings
                </h3>
            </div>

            <div className="divide-y divide-gray-100">
                {visibleStudents.map((s) => {
                    const isCurrentUser = s.student_id === currentUserId;
                    return (
                        <div
                            key={s.student_id}
                            className={`px-4 md:px-5 py-3 md:py-4 transition ${isCurrentUser
                                ? "bg-kidemia-primary/5 border-l-4 border-kidemia-primary"
                                : "hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="text-xs md:text-sm font-bold w-5 md:w-6 text-center text-kidemia-primary">
                                    {s.rank}
                                </div>

                                <img
                                    src={s.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.student_name)}&background=random`}
                                    alt={s.student_name}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-xs md:text-sm truncate">
                                        {s.student_name}
                                        {isCurrentUser && (
                                            <span className="ml-2 text-[10px] md:text-xs bg-kidemia-primary text-white px-1.5 md:px-2 py-0.5 rounded-full">
                                                You
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500">
                                        <span className="flex items-center gap-0.5 md:gap-1">
                                            <Award className="w-3 h-3" />
                                            Level {s.level}
                                        </span>
                                        <span className="flex items-center gap-0.5">
                                            <Flame className="w-3 h-3 text-orange-500" />
                                            {s.streak_days}d
                                        </span>
                                    </div>
                                </div>

                                {s.badges && s.badges.length > 0 && (
                                    <div className="hidden sm:flex gap-1.5">
                                        {s.badges.slice(0, 2).map((b) => (
                                            <span
                                                key={b.id}
                                                className={`${getBadgeColorClass(b.rarity!)} px-2 py-1 rounded-lg text-xs`}
                                                title={b.display_name}
                                            >
                                                {b.icon_url ? (
                                                    <img src={b.icon_url} alt={b.display_name} className="w-3 h-3" />
                                                ) : (
                                                    "🏆"
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-1 md:gap-2">
                                    {s.trend === "up" && <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />}
                                    {s.trend === "down" && <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-red-500 rotate-180" />}
                                    {s.trend === "same" && <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400 rotate-90" />}
                                    <div className="text-xs md:text-sm font-semibold text-kidemia-primary">
                                        {s.points.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Intersection Sentinel */}
            {visibleCount < students.length && (
                <div
                    ref={loaderRef}
                    className="p-6 text-center text-gray-400 text-xs font-medium animate-pulse"
                >
                    Scrolling for more...
                </div>
            )}
        </div>
    );
};