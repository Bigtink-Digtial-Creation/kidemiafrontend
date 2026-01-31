import { useState } from "react";
import type { StudentPerformanceResponse } from "../../../sdk/generated";
import TopicStatCard from "./TopicStatCard";
import { AlertCircle, BarChart3, CheckCircle } from "lucide-react";

export default function TopicSection({ data }: { data: StudentPerformanceResponse }) {
    const [filter, setFilter] = useState<'ALL' | 'MASTERED' | 'DEVELOPING' | 'NEEDS_ATTENTION'>('ALL');

    // Logic for filtering and sorting
    const filteredTopics = data.topic_breakdown?.filter(topic => {
        if (filter === 'ALL') return true;
        if (filter === 'NEEDS_ATTENTION') return (topic.success_rate || 0) < 60;
        return topic.mastery_level === filter;
    }).sort((a, b) => (a.success_rate || 0) - (b.success_rate || 0)); // Sort by lowest score first to show trouble areas

    return (
        <div className="space-y-6">
            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TopicStatCard
                    icon={<CheckCircle className="text-emerald-600" />}
                    label="Mastered"
                    count={data.topic_breakdown?.filter(t => t.mastery_level === 'MASTERED').length}
                    color="emerald"
                />
                <TopicStatCard
                    icon={<AlertCircle className="text-orange-600" />}
                    label="Needs Work"
                    count={data.topic_breakdown?.filter(t => (t.success_rate || 0) < 60).length}
                    color="orange"
                />
                <TopicStatCard
                    icon={<BarChart3 className="text-blue-600" />}
                    label="Total Topics"
                    count={data.topic_breakdown?.length}
                    color="blue"
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-bold text-lg text-slate-800">Topic Proficiency</h3>

                    <div className="flex flex-wrap gap-2">
                        {['ALL', 'MASTERED', 'DEVELOPING', 'NEEDS_ATTENTION'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === f
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredTopics && filteredTopics.length > 0 ? (
                        filteredTopics.map((topic, i) => (
                            <div key={i} className="p-4 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-10 rounded-full ${(topic.success_rate || 0) >= 80 ? 'bg-emerald-500' :
                                        (topic.success_rate || 0) >= 60 ? 'bg-kidemia-secondary' : 'bg-orange-500'
                                        }`} />
                                    <div>
                                        <p className="font-bold text-slate-900">{topic.topic_name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{topic.subject_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider">Accuracy</p>
                                        <p className={`font-bold text-lg ${(topic.success_rate || 0) < 60 ? 'text-orange-600' : 'text-slate-900'
                                            }`}>
                                            {topic.success_rate}%
                                        </p>
                                    </div>

                                    <div className="min-w-[100px] text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${topic.mastery_level === 'MASTERED'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {topic.mastery_level?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-slate-400 font-medium italic">No topics found matching this filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}