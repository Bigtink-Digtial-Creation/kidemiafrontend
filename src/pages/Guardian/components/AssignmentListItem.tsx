import { useNavigate } from "react-router";
import type { AssignmentMonitor } from "../type";
import { GuardianRoutes } from "../../../routes";
import { Avatar, Chip, Progress } from "@heroui/react";
import { FiAlertTriangle, FiChevronRight, FiClock } from "react-icons/fi";



export default function AssignmentListItem({ assignment }: { assignment: AssignmentMonitor }) {
    const navigate = useNavigate();
    const hasViolations = (assignment.tab_switches || 0) > 2 || (assignment.webcam_violations || 0) > 0;

    const getStatusTheme = (status: string) => {
        switch (status) {
            case "completed": return "success";
            case "overdue": return "danger";
            case "started": return "warning";
            default: return "default";
        }
    };

    return (
        <div
            className="group py-5 px-2 hover:bg-slate-50/80 transition-colors cursor-pointer"
            onClick={() => navigate(GuardianRoutes.assessmentDetail.replace(":assignmentId", assignment.id))}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                    <Avatar
                        name={assignment.ward_name}
                        className="hidden sm:flex flex-shrink-0 bg-blue-100 text-blue-600 font-semibold"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">
                                {assignment.assessment_title}
                            </h3>
                            <Chip size="sm" variant="flat" color={getStatusTheme(assignment.status) as any} className="capitalize h-5 text-[10px]">
                                {assignment.status}
                            </Chip>
                            {hasViolations && (
                                <Chip size="sm" variant="flat" color="warning" className="h-5 text-[10px]" startContent={<FiAlertTriangle />}>
                                    Violations
                                </Chip>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center text-xs text-slate-500 gap-x-4 gap-y-1">
                            <span className="font-medium text-slate-700 flex items-center gap-1 sm:hidden">
                                {assignment.ward_name} •
                            </span>
                            <span className="hidden sm:inline font-medium text-slate-700">{assignment.ward_name}</span>
                            <span className="flex items-center gap-1">
                                <FiClock className="text-[10px]" />
                                {new Date(assignment.assigned_at).toLocaleDateString()}
                            </span>
                            <span>Attempts: {assignment.attempt_count}/{assignment.max_attempts}</span>
                        </div>

                        {assignment.status === "started" && (
                            <div className="mt-3 w-40">
                                <Progress size="sm" isIndeterminate className="h-1" color="primary" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden flex flex-col items-end justify-between self-stretch">
                    {assignment.status === "completed" ? (
                        <div className="text-right">
                            <div className={`text-xl font-black ${assignment.passed ? 'text-green-600' : 'text-slate-900'}`}>
                                {assignment.percentage}%
                            </div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                        </div>
                    ) : (
                        <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                            <FiChevronRight size={20} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}