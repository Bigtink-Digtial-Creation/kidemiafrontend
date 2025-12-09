import { Trophy } from "lucide-react";


export const RankListSkeleton = () => (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-200/50 overflow-hidden">
        <div className="p-4 md:p-5 border-b border-gray-200/50">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-kidemia-primary" />
                Full Rankings
            </h3>
        </div>
        <div className="divide-y divide-gray-100">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="px-4 md:px-5 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="w-5 md:w-6 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-32" />
                            <div className="h-2 md:h-3 bg-gray-200 rounded animate-pulse w-24" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);