/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Button,
    Select,
    SelectItem,
    Input,
} from "@heroui/react";
import {
    FiSearch,
    FiFilter,
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiUsers,
    FiTrendingUp,
    FiActivity,
} from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { useNavigate } from "react-router";
import { GuardianRoutes } from "../../routes";
import type { AssignmentMonitor } from "./type";
import AssignmentListItem from "./components/AssignmentListItem";
import StatBox from "./components/StatBox";



export default function GuardianMonitoringDashboard() {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [wardFilter, setWardFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: guardianData } = useQuery({
        queryKey: [QueryKeys.guardianProfile],
        queryFn: () => ApiSDK.GuardiansService.getMyGuardianProfileApiV1GuardiansMeGet(),
    });

    const guardianId = guardianData?.data?.id;

    const { data: wardsData } = useQuery({
        queryKey: [QueryKeys.myWards, guardianId],
        queryFn: () => ApiSDK.GuardiansService.getMyWardsApiV1GuardiansGuardianIdWardsGet(guardianId!),
        enabled: !!guardianId,
    });

    const { data: assignmentsData, isLoading } = useQuery({
        queryKey: [QueryKeys.assignments, guardianId, statusFilter, wardFilter],
        queryFn: () =>
            ApiSDK.GuardiansService.getWardAssignmentsApiV1GuardiansGuardianIdAssignmentsGet(
                guardianId!,
                wardFilter !== "all" ? wardFilter : undefined,
                statusFilter !== "all" ? statusFilter : undefined,
                0,
                100
            ),
        enabled: !!guardianId,
    });

    const assignments: AssignmentMonitor[] = assignmentsData?.data || [];

    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSearch =
            assignment.assessment_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.ward_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const stats = {
        total: assignments.length,
        assigned: assignments.filter((a) => a.status === "assigned").length,
        inProgress: assignments.filter((a) => a.status === "started").length,
        completed: assignments.filter((a) => a.status === "completed").length,
        overdue: assignments.filter((a) => a.status === "overdue").length,
        violations: assignments.filter(
            (a) => (a.tab_switches && a.tab_switches > 3) || (a.webcam_violations && a.webcam_violations > 0)
        ).length,
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header Area */}
            <div className="px-4 pt-8 md:px-8 max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            Monitoring
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base">Real-time ward performance tracking</p>
                    </div>
                    <Button
                        color="primary"
                        variant="flat"
                        startContent={<FiUsers />}
                        onPress={() => navigate(GuardianRoutes.createAssessment)}
                        className="w-full md:w-auto bg-kidemia-secondary text-white"
                    >
                        New Assessment
                    </Button>
                </header>

                {/* Stats: Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 no-scrollbar">
                    <StatBox label="Total" value={stats.total} icon={<FiActivity />} color="text-slate-600" bg="bg-slate-50" />
                    <StatBox label="Active" value={stats.assigned} icon={<FiClock />} color="text-blue-600" bg="bg-blue-50" />
                    <StatBox label="Started" value={stats.inProgress} icon={<FiTrendingUp />} color="text-amber-600" bg="bg-amber-50" />
                    <StatBox label="Done" value={stats.completed} icon={<FiCheckCircle />} color="text-green-600" bg="bg-green-50" />
                    <StatBox label="Late" value={stats.overdue} icon={<FiAlertTriangle />} color="text-red-600" bg="bg-red-50" />
                    <StatBox label="Alerts" value={stats.violations} icon={<FiAlertTriangle />} color="text-orange-600" bg="bg-orange-50" />
                </div>

                {/* Search & Filters: Refined UI */}
                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input
                            placeholder="Search by student or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startContent={<FiSearch className="text-slate-400" />}
                            variant="bordered"
                            className="flex-grow"
                        />
                        <div className="flex gap-2">
                            <Select
                                aria-label="Status"
                                placeholder="Status"
                                selectedKeys={[statusFilter]}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                variant="bordered"
                                className="w-full md:w-32"
                            >
                                <SelectItem key="all">All</SelectItem>
                                <SelectItem key="assigned">Assigned</SelectItem>
                                <SelectItem key="completed">Completed</SelectItem>
                            </Select>
                            <Select
                                aria-label="Ward"
                                placeholder="Ward"
                                selectedKeys={[wardFilter]}
                                onChange={(e) => setWardFilter(e.target.value)}
                                variant="bordered"
                                className="w-full md:w-40"
                            >
                                <SelectItem key="all">All Wards</SelectItem>
                                {(wardsData?.data || []).map((ward: any) => (
                                    <SelectItem key={ward.id}>{ward.full_name}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Main List */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Assignments</h2>
                        <span className="text-xs text-slate-400">{filteredAssignments.length} found</span>
                    </div>

                    <div className="divide-y divide-slate-100 border-t border-slate-100">
                        {isLoading ? (
                            <div className="py-20 text-center text-slate-400 animate-pulse">Fetching updates...</div>
                        ) : filteredAssignments.length === 0 ? (
                            <div className="py-20 text-center bg-slate-50/50 rounded-xl mt-4">
                                <FiFilter className="mx-auto text-3xl text-slate-300 mb-2" />
                                <p className="text-slate-500">No results match your filter</p>
                            </div>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                <AssignmentListItem key={assignment.id} assignment={assignment} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



