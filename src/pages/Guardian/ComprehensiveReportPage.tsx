import {
    Button,
    Progress,
    addToast,
    Divider
} from "@heroui/react";
import {
    FiAlertTriangle,
    FiDownload,
    FiActivity,
    FiCheckCircle,
    FiStar
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import SpinnerCircle from "../../components/Spinner/Circle";

// --- Explicit TypeScript Interfaces ---
interface WardSummary {
    ward_id: string;
    ward_name: string;
    category_name: string | null;
    total_assessments: number;
    completed_assessments: number;
    avg_overall_score: number;
    performance_trend: string;
}

interface ComprehensiveReport {
    guardian_id: string;
    total_wards: number;
    active_wards: number;
    overall_avg_score: number;
    total_assessments_assigned: number;
    total_assessments_completed: number;
    ward_summaries: WardSummary[];
    top_performing_ward: string | null;
    generated_at: string;
}

export default function ComprehensiveReportPage() {
    const { data: guardianData } = useQuery({
        queryKey: [QueryKeys.guardianProfile],
        queryFn: async () => ApiSDK.GuardiansService.getMyGuardianProfileApiV1GuardiansMeGet(),
    });

    const guardianId = guardianData?.data?.id;

    const { data: report, isLoading, error } = useQuery<ComprehensiveReport>({
        queryKey: [QueryKeys.comprehensiveReport, guardianId],
        queryFn: async () => {
            if (!guardianId) throw new Error("Guardian ID not found");
            const response = await ApiSDK.GuardiansService.getComprehensiveReportApiV1GuardiansGuardianIdComprehensiveReportGet(guardianId);
            return response.data;
        },
        enabled: !!guardianId,
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <SpinnerCircle />
            <span className="mt-4 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Synchronizing Data</span>
        </div>
    );

    // Defense: If error or report is missing critical fields
    if (error || !report) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <FiAlertTriangle className="text-3xl text-red-500 mb-4" />
            <h2 className="text-lg font-bold text-slate-800">Connection Interrupted</h2>
            <p className="text-slate-500 text-sm mb-6">We couldn't reach the reporting server. Verify your connection.</p>
            <Button size="sm" variant="flat" onPress={() => window.location.reload()}>Reconnect</Button>
        </div>
    );

    // Safe calculation with fallbacks
    const totalAssigned = report.total_assessments_assigned ?? 0;
    const totalCompleted = report.total_assessments_completed ?? 0;
    const overallScore = report.overall_avg_score ?? 0;

    const completionRate = totalAssigned > 0
        ? (totalCompleted / totalAssigned) * 100
        : 0;

    return (
        <div className="max-w-screen-xl mx-auto px-6 py-10 antialiased text-slate-900 bg-white">

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Academic <span className="text-slate-400 font-light">Performance</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded text-slate-500">System Report</span>
                        <span className="text-xs text-slate-400 font-medium">
                            Snapshot: {report.generated_at ? new Date(report.generated_at).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
                <Button
                    className="bg-kidemia-secondary text-white rounded-lg px-6 font-bold text-xs h-11"
                    onPress={() => addToast({ title: "Generation in progress", color: "primary" })}
                    startContent={<FiDownload className="text-sm" />}
                >
                    GENERATE PDF
                </Button>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                <MetricBlock
                    label="Proficiency"
                    value={`${overallScore.toFixed(1)}%`}
                    subtext="Aggregate Avg"
                    status={overallScore >= 70 ? "positive" : "neutral"}
                />
                <MetricBlock
                    label="Active Students"
                    value={report.active_wards ?? 0}
                    subtext={`of ${report.total_wards ?? 0} profiles`}
                />
                <MetricBlock
                    label="Completion"
                    value={`${completionRate.toFixed(0)}%`}
                    subtext={`${totalCompleted} total tasks`}
                />
                <MetricBlock
                    label="Lead Ward"
                    value={report.top_performing_ward || "N/A"}
                    subtext="Highest Performer"
                    isTextLarge={!!report.top_performing_ward && report.top_performing_ward.length > 10}
                />
            </div>

            <Divider className="mb-20 bg-slate-100" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Ward Metrics</h2>
                        <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>

                    <div className="space-y-16">
                        {(report.ward_summaries || []).map((ward: WardSummary) => {
                            const wardScore = ward.avg_overall_score ?? 0;
                            const wardTotal = ward.total_assessments ?? 1;
                            const wardDone = ward.completed_assessments ?? 0;

                            return (
                                <div key={ward.ward_id} className="group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                                                {ward.ward_name?.charAt(0) || "W"}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{ward.ward_name}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{ward.category_name || "General Program"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[10px] font-black text-slate-300 uppercase">Score</span>
                                            <span className="text-4xl font-light tracking-tighter text-slate-900">
                                                {wardScore.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
                                        <div
                                            className="bg-kidemia-secondary h-full rounded-full transition-all duration-700"
                                            style={{ width: `${(wardDone / wardTotal) * 100}%` }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-8">
                                        <SubStat label="Assessments" value={`${wardDone}/${wardTotal}`} />
                                        <SubStat label="Trend" value={ward.performance_trend || "Stable"} capitalize />
                                        <SubStat label="ID" value={ward.ward_id?.slice(0, 6) || "---"} isMono />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-slate-50 rounded-2xl p-8 sticky top-10 border border-slate-100">
                        <div className="flex items-center gap-2 mb-8">
                            <FiActivity className="text-slate-900" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Intelligence Brief</h2>
                        </div>

                        <div className="space-y-10">
                            {overallScore >= 80 && (
                                <BriefingItem
                                    icon={<FiStar className="text-orange-500" />}
                                    title="Peak Achievement"
                                    text="Proficiency levels are optimal. Current study patterns are effective."
                                />
                            )}
                            {completionRate < 70 && (
                                <BriefingItem
                                    icon={<FiActivity className="text-blue-500" />}
                                    title="Fulfillment Gap"
                                    text="Completion is below threshold. Modules require immediate focus."
                                />
                            )}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">
                                <span>Global Goal</span>
                                <span className="text-slate-900">{completionRate.toFixed(0)}%</span>
                            </div>
                            <Progress
                                value={completionRate}
                                size="sm"
                                className="bg-slate-200"
                                classNames={{
                                    indicator: "bg-kidemia-secondary"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Internal Visual Components ---
function MetricBlock({ label, value, subtext, status = "neutral", isTextLarge = false }: any) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">{label}</span>
            <div className={`font-light tracking-tighter text-slate-900 ${isTextLarge ? 'text-2xl pt-2' : 'text-5xl'}`}>
                {value}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
                {status === "positive" && <FiCheckCircle className="text-green-500 text-xs" />}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{subtext}</span>
            </div>
        </div>
    );
}

function SubStat({ label, value, capitalize = false, isMono = false }: any) {
    return (
        <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-bold text-slate-700 ${capitalize ? 'capitalize' : ''} ${isMono ? 'font-mono' : ''}`}>
                {value}
            </p>
        </div>
    );
}

function BriefingItem({ icon, title, text }: any) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 text-lg">{icon}</div>
            <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{text}</p>
            </div>
        </div>
    );
}