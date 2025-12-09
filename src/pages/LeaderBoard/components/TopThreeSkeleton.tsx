import { Crown } from "lucide-react";



export const TopThreeSkeleton = () => (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-200/50">
        <h3 className="text-sm font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            Top Performers
        </h3>
        <div className="space-y-2 md:space-y-3">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`rounded-xl md:rounded-2xl p-3 md:p-4 ${i === 0
                        ? "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"
                        : i === 1
                            ? "bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-300"
                            : "bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200"
                        }`}
                >
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-32" />
                            <div className="h-2 md:h-3 bg-gray-200 rounded animate-pulse w-24" />
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-16" />
                            <div className="h-2 md:h-3 bg-gray-200 rounded animate-pulse w-8" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);