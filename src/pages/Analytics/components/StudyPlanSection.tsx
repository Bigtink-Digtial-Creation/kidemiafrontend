import type { StudentPerformanceResponse } from "../../../sdk/generated";


export default function StudyPlanSection({ data }: { data: StudentPerformanceResponse }) {
    if (!data.study_plan) return <div className="p-12 text-center text-slate-500">Plan generating...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-kidemia-primary to-kidemia-secondary rounded-2xl p-6 md:p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{data.study_plan.duration_days}-Day Growth Path</h3>
                <p className="opacity-90">Focusing on {data.study_plan.focus_areas.length} key areas to improve your score.</p>
                <div className="mt-6 flex gap-8">
                    <div>
                        <p className="text-xs font-bold opacity-70 uppercase">Daily Goal</p>
                        <p className="text-xl font-bold">{data.study_plan.daily_study_minutes} mins</p>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div>
                        <p className="text-xs font-bold opacity-70 uppercase">Next Milestone</p>
                        <p className="text-xl font-bold">{data.study_plan.milestones[0]?.target || 'Keep Going!'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.study_plan.focus_areas.map((area, i) => (
                    <div key={i} className="bg-white border-l-4 border-l-kidemia-primary border border-slate-200 p-4 rounded-xl">
                        <p className="text-[10px] font-black text-kidemia-primary uppercase mb-1">Priority {area.priority}</p>
                        <h4 className="font-bold text-slate-900 leading-tight mb-2">{area.topic}</h4>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Daily Focus:</span>
                            <span className="font-bold text-slate-900">{area.daily_minutes}m</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
