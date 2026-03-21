import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
    Tabs, Tab, Skeleton,
} from "@heroui/react";
import {
    FiCheckCircle, FiClock, FiAlertCircle,
    FiBookOpen, FiPlay, FiEye, FiShield,
} from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { AssessmentRoutes } from "../../routes";




function InstitutionAssignmentCard({
    assignment,
    navigate,
}: {
    assignment: any;
    navigate: ReturnType<typeof useNavigate>;
}) {
    const isCompleted = assignment.status === "completed";
    const isOverdue = assignment.status === "overdue";
    const isStarted = assignment.status === "started";
    const isAvailable =
        !assignment.available_from ||
        new Date(assignment.available_from) <= new Date();

    const statusConfig = {
        completed: { color: "bg-green-50 border-green-100", badge: "green" },
        overdue: { color: "bg-red-50 border-red-100", badge: "red" },
        started: { color: "bg-blue-50 border-blue-100", badge: "blue" },
        not_started: { color: "bg-white border-gray-100", badge: "gray" },
    } as const;

    const config =
        statusConfig[assignment.status as keyof typeof statusConfig] ??
        statusConfig.not_started;


    return (
        <div
            className={`rounded-2xl border shadow-sm p-4 sm:p-5 transition-shadow hover:shadow-md ${config.color}`}
        >
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Left — info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {assignment.subject_name && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                {assignment.subject_name}
                            </span>
                        )}
                        <span className="text-xs text-gray-400 capitalize">
                            via {assignment.assigned_via}
                        </span>
                        {assignment.requires_webcam && (
                            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                <FiShield size={10} /> Proctored
                            </span>
                        )}
                    </div>

                    <h3 className="font-bold text-gray-800 text-base sm:text-lg leading-tight mb-1 truncate">
                        {assignment.assessment_title}
                    </h3>

                    {assignment.institution_name && (
                        <p className="text-xs text-gray-400 mb-3">
                            {assignment.institution_name}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <FiBookOpen size={12} />
                            {assignment.total_questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                            <FiClock size={12} />
                            {assignment.duration_minutes} mins
                        </span>
                        {assignment.due_date && !isCompleted && (
                            <span
                                className={`flex items-center gap-1 font-medium ${isOverdue ? "text-red-500" : "text-amber-600"
                                    }`}
                            >
                                <FiAlertCircle size={12} />
                                Due {new Date(assignment.due_date).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        )}
                        <span className="text-gray-400">
                            {assignment.attempt_count}/{assignment.max_attempts} attempt
                            {assignment.max_attempts !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {assignment.instructions && (
                        <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
                            "{assignment.instructions}"
                        </p>
                    )}
                </div>

                {/* Right — score + action */}
                <div className="flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-center sm:min-w-[140px] gap-3">
                    {isCompleted && assignment.score !== null && (
                        <div className="text-center">
                            <p
                                className={`text-2xl font-bold ${assignment.score >= 75
                                    ? "text-green-600"
                                    : assignment.score >= 60
                                        ? "text-orange-500"
                                        : "text-red-500"
                                    }`}
                            >
                                {assignment.score.toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                {assignment.grade ?? (assignment.passed ? "Pass" : "Fail")}
                            </p>
                        </div>
                    )}

                    {!isAvailable ? (
                        <div className="px-4 py-2.5 rounded-xl bg-gray-100 text-xs text-gray-400 text-center">
                            Available{" "}
                            {new Date(assignment.available_from).toLocaleDateString()}
                        </div>
                    ) : (
                        <button
                            disabled={
                                isOverdue ||
                                (isCompleted && assignment.attempt_count >= assignment.max_attempts)
                            }
                            onClick={() => {
                                if (isCompleted) {
                                    navigate(
                                        AssessmentRoutes.assessmentResult.replace(
                                            ":assessment_id",
                                            assignment.assessment_id
                                        )
                                    );
                                } else {
                                    navigate(
                                        AssessmentRoutes.assessmentInstructions
                                            .replace(":assessment_id", assignment.assessment_id)
                                            .replace(":id", assignment.assessment_id)
                                    );
                                }
                            }}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isCompleted
                                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : isOverdue
                                    ? "bg-red-100 text-red-500"
                                    : "text-white hover:opacity-90"
                                }`}
                            style={
                                !isCompleted && !isOverdue
                                    ? { backgroundColor: "#e07b39" }
                                    : {}
                            }
                        >
                            {isCompleted ? (
                                <><FiEye size={14} /> Results</>
                            ) : isStarted ? (
                                <><FiPlay size={14} /> Continue</>
                            ) : isOverdue ? (
                                "Overdue"
                            ) : (
                                <><FiPlay size={14} /> Start</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────
export default function InstitutionAssignmentList() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("pending");

    const { data: assignments = [], isLoading } = useQuery({
        queryKey: [QueryKeys.institutionAssignments],
        queryFn: () =>
            ApiSDK.InstitutionService.getInstitutionAssignmentsApiV1InstitutionMyAssignmentsInstitutionGet(),
    });

    const counts = useMemo(
        () => ({
            pending: assignments.filter(
                (a: any) => a.status === "not_started" || a.status === "started"
            ).length,
            completed: assignments.filter((a: any) => a.status === "completed")
                .length,
            overdue: assignments.filter((a: any) => a.status === "overdue").length,
        }),
        [assignments]
    );

    const filtered = assignments.filter((a: any) => {
        if (activeTab === "pending")
            return a.status === "not_started" || a.status === "started";
        if (activeTab === "completed") return a.status === "completed";
        if (activeTab === "overdue") return a.status === "overdue";
        return true;
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <header className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    School Assignments
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Assessments assigned to you by your school
                </p>
            </header>

            <Tabs
                variant="underlined"
                color="primary"
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                classNames={{
                    tabList:
                        "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-primary font-semibold",
                }}
            >
                <Tab
                    key="pending"
                    title={
                        <span className="flex items-center gap-1.5">
                            Pending
                            {counts.pending > 0 && (
                                <span className="text-xs bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full">
                                    {counts.pending}
                                </span>
                            )}
                        </span>
                    }
                />
                <Tab key="completed" title={`Completed (${counts.completed})`} />
                <Tab
                    key="overdue"
                    title={
                        <span className="flex items-center gap-1.5">
                            Overdue
                            {counts.overdue > 0 && (
                                <span className="text-xs bg-red-100 text-red-500 font-bold px-1.5 py-0.5 rounded-full">
                                    {counts.overdue}
                                </span>
                            )}
                        </span>
                    }
                />
            </Tabs>

            <div className="mt-6 space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="rounded-2xl h-32 w-full" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl border-gray-200">
                        <FiCheckCircle className="mx-auto text-4xl text-gray-300 mb-3" />
                        <p className="text-gray-400">
                            No {activeTab} assignments from your school.
                        </p>
                    </div>
                ) : (
                    filtered.map((a: any) => (
                        <InstitutionAssignmentCard
                            key={a.id}
                            assignment={a}
                            navigate={navigate}
                        />
                    ))
                )}
            </div>
        </div>
    );
}