import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardBody,
    Button,
    Chip,
    Avatar,
    Spinner,
    CircularProgress,
} from "@heroui/react";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiVideo,
    FiMaximize,
    FiEye,
    FiShield,
} from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { GuardianRoutes } from "../../routes";

// --- The Interface ---
interface AssignmentDetail {
    id: string;
    assessment_id: string;
    assessment_title: string;
    ward_id: string;
    ward_name: string;
    ward_email: string;
    assigned_at: string;
    due_date: string | null;
    status: string;
    instructions: string | null;
    duration_minutes: number;
    total_questions: number;
    passing_percentage: number;
    max_attempts: number;
    attempt_count: number;
    attempts_remaining: number;
    started_at: string | null;
    completed_at: string | null;
    last_attempt_date: string | null;
    last_attempt_score: number | null;
    last_attempt_time_spent: number | null;
    score: number | null;
    percentage: number | null;
    passed: boolean | null;
    proctoring_enabled: boolean;
    tab_switches: number | null;
    webcam_violations: number | null;
    fullscreen_exits: number | null;
    attempts: Array<{
        id: string;
        started_at: string;
        completed_at: string | null;
        score: number | null;
        percentage: number | null;
        passed: boolean | null;
        time_spent: number | null;
        violations: {
            tab_switches: number;
            webcam_violations: number;
            fullscreen_exits: number;
        };
    }>;
}

export default function AssignmentDetailPage() {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();

    const { data: assignmentData, isLoading } = useQuery({
        queryKey: [QueryKeys.assignmentDetail, assignmentId],
        queryFn: () => ApiSDK.GuardiansService.getAssignmentDetailApiV1GuardiansAssignmentsAssignmentIdGet(assignmentId!),
        enabled: !!assignmentId,
    });

    const assignment = assignmentData?.data as AssignmentDetail;

    if (isLoading || !assignment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Spinner size="lg" label="Validating credentials..." />
            </div>
        );
    }

    // const isCompleted = assignment.status === "completed";
    const totalViolations = (assignment.tab_switches || 0) + (assignment.webcam_violations || 0) + (assignment.fullscreen_exits || 0);

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* Nav Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Button variant="flat" size="sm" className="bg-kidemia-secondary text-white" startContent={<FiArrowLeft />} onPress={() => navigate(GuardianRoutes.monitor)}>
                        Back to List
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold leading-tight">{assignment.ward_name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Guardian Monitoring</p>
                        </div>
                        <Avatar name={assignment.ward_name} className="bg-gradient-to-tr from-blue-500 to-indigo-600 text-white" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                {/* Hero Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                            {assignment.assessment_title}
                        </h1>
                        <div className="flex flex-wrap gap-4">
                            <Chip color="primary" variant="flat" startContent={<FiCalendar />}>Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}</Chip>
                            {assignment.due_date && (
                                <Chip color="danger" variant="flat" startContent={<FiClock />}>Due: {new Date(assignment.due_date).toLocaleDateString()}</Chip>
                            )}
                        </div>
                    </div>
                    <div className="hidden flex items-end justify-end gap-3">
                        <Button className="bg-white border-2 border-slate-200 font-bold">Message Student</Button>
                        <Button className="bg-black text-white font-bold">Reset Attempt</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT PANEL: Results & Integrity */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Score Section */}
                        <Card className="shadow-2xl shadow-blue-100 border-none p-4">
                            <CardBody className="items-center text-center py-10">
                                <CircularProgress
                                    classNames={{ svg: "w-48 h-48", value: "text-4xl font-black" }}
                                    value={assignment.percentage || 0}
                                    strokeWidth={4}
                                    showValueLabel={true}
                                    color={assignment.passed ? "success" : "danger"}
                                />
                                <div className="mt-4">
                                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Final Grade</p>
                                    <h2 className={`text-2xl font-black ${assignment.passed ? 'text-green-600' : 'text-red-600'}`}>
                                        {assignment.passed ? "PASSED" : "FAILED"}
                                    </h2>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Integrity Card */}
                        <Card className="border-none shadow-sm">
                            <CardBody className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold flex items-center gap-2"><FiShield className="text-blue-600" /> Integrity Report</h3>
                                    <Chip size="sm" color={totalViolations > 5 ? "danger" : "success"} variant="flat">
                                        {totalViolations > 5 ? "Flagged" : "Secure"}
                                    </Chip>
                                </div>
                                <div className="space-y-4">
                                    <ProctoringItem icon={<FiEye />} label="Tab Switches" value={assignment.tab_switches || 0} limit={3} />
                                    <ProctoringItem icon={<FiVideo />} label="Webcam Alerts" value={assignment.webcam_violations || 0} limit={0} />
                                    <ProctoringItem icon={<FiMaximize />} label="Fullscreen Exits" value={assignment.fullscreen_exits || 0} limit={0} />
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* RIGHT PANEL: History */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border-none shadow-sm min-h-[400px]">
                            <CardBody className="p-8">
                                <h3 className="text-xl font-black mb-8">Attempt History</h3>
                                <div className="relative border-l-2 border-slate-100 ml-4 space-y-10">
                                    {assignment.attempts.map((attempt, i) => (
                                        <div key={attempt.id} className="relative pl-10">
                                            <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm ${attempt.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <div className="flex flex-col md:flex-row justify-between bg-slate-50 p-6 rounded-2xl group hover:bg-blue-50 transition-colors">
                                                <div>
                                                    <p className="text-blue-600 font-black text-xs uppercase mb-1">Session {i + 1}</p>
                                                    <h4 className="font-bold text-slate-800">{new Date(attempt.started_at).toLocaleString()}</h4>
                                                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                                                        <FiClock /> {attempt.time_spent ? `${Math.floor(attempt.time_spent / 60)}m` : 'Incomplete'}
                                                    </p>
                                                </div>
                                                <div className="mt-4 md:mt-0 text-right">
                                                    <p className={`text-3xl font-black ${attempt.passed ? 'text-green-600' : 'text-slate-400'}`}>
                                                        {attempt.percentage ?? '0'}%
                                                    </p>
                                                    <Chip size="sm" variant="flat" color={attempt.passed ? "success" : "default"}>
                                                        {attempt.passed ? "Succeeded" : "Failed"}
                                                    </Chip>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Internal Helper Components for the interface
function ProctoringItem({ icon, label, value, limit }: { icon: any, label: string, value: number, limit: number }) {
    const isBad = value > limit;
    return (
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
                <span className={isBad ? "text-red-500" : "text-slate-400"}>{icon}</span>
                <span className="text-sm font-semibold text-slate-700">{label}</span>
            </div>
            <span className={`text-sm font-black ${isBad ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
        </div>
    );
}