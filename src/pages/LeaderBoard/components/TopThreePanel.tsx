import { Award, Crown, Flame } from "lucide-react";
import type { LeaderboardEntryResponse } from "../../../sdk/generated";


export interface TopThreePanelProps {
    students: LeaderboardEntryResponse[];
    currentUserId?: string;
}


export const TopThreePanel = ({ students, currentUserId }: TopThreePanelProps) => {
    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-200/50">
            <h3 className="text-sm font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Top Performers
            </h3>

            <div className="space-y-2 md:space-y-3">
                {students.map((s, i) => (
                    <div
                        key={s.student_id}
                        className={`group bg-gradient-to-br rounded-xl md:rounded-2xl p-3 md:p-4 hover:scale-[1.02] transition cursor-pointer ${i === 0
                            ? "from-amber-50 to-yellow-50 border border-amber-200"
                            : i === 1
                                ? "from-gray-50 to-slate-50 border border-gray-300"
                                : "from-orange-50 to-amber-50 border border-orange-200"
                            }`}
                    >
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="relative">
                                <img
                                    src={s.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.student_name)}&background=random`}
                                    alt={s.student_name}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md"
                                />
                                <div
                                    className={`absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-gray-400" : "bg-orange-500"
                                        }`}
                                >
                                    {s.rank}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-xs md:text-sm truncate">
                                    {s.student_name}
                                    {s.student_id === currentUserId && (
                                        <span className="ml-2 text-[10px] md:text-xs bg-kidemia-primary text-white px-1.5 md:px-2 py-0.5 rounded-full">
                                            You
                                        </span>
                                    )}
                                </h4>
                                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-600">
                                    <span className="flex items-center gap-0.5 md:gap-1">
                                        <Award className="w-3 h-3" />
                                        Lvl {s.level}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                        <Flame className="w-3 h-3 text-orange-500" />
                                        {s.streak_days}d
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-xs md:text-sm font-semibold text-kidemia-primary">
                                    {s.points.toLocaleString()}
                                </div>
                                <div className="text-[10px] md:text-xs text-gray-500">pts</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};