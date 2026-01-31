import { BookOpen, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import type { StudentPerformanceResponse } from "../../../sdk/generated";
import MetricCard from "./MetricCard";
import ChartCard from "./ChartCard";
import RecommendationCard from "./RecommendationCard";


export default function OverviewSection({ data }: { data: StudentPerformanceResponse }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={Target} label="Avg Score" value={`${data.performance_summary?.average_score}%`} trend="+5.2%" color="primary" />
                <MetricCard icon={BookOpen} label="Attempts" value={data.performance_summary?.completed_attempts} color="secondary" />
                <MetricCard icon={TrendingUp} label="Pass Rate" value={`${data.performance_summary?.pass_rate}%`} color="emerald" />
                <MetricCard icon={Trophy} label="Best" value={`${data.performance_summary?.best_score}%`} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Subject Mastery" icon={<Zap className="text-kidemia-primary" />}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <RadarChart data={data.subject_breakdown?.map(s => ({ name: s.subject_name.slice(0, 10), score: s.average_score }))}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Radar name="Score" dataKey="score" stroke="#BF4C20" fill="#BF4C20"
                                fillOpacity={0.5} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Performance Growth" icon={<TrendingUp className="text-kidemia-secondary" />}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <LineChart data={data.progress_over_time}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" hide />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="average_score" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, fill: '#6366F1' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Focus Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.personalized_recommendations?.map((rec, i) => (
                        <RecommendationCard key={i} rec={rec} />
                    ))}
                </div>
            </div>
        </div>
    );
}