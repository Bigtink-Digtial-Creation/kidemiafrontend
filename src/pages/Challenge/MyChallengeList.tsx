import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Tabs,
    Tab,
    Skeleton,
} from "@heroui/react";
import {
    FiCheckCircle,
} from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { useNavigate } from "react-router";
import WardAssignmentCard from "./components/WardAssignmentCard";

export default function WardChallengeList() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>("pending");

    const { data: assignmentsData, isLoading } = useQuery({
        queryKey: [QueryKeys.wardAssignments],
        queryFn: () => ApiSDK.WardsService.getMyAssignmentsApiV1WardsAssignmentsGet(),
    });

    const assignments = assignmentsData?.data || [];

    // Memoized counts for the Tab badges
    const counts = useMemo(() => ({
        pending: assignments.filter((a: any) =>
            a.status === "assigned" || a.status === "started"
        ).length,
        completed: assignments.filter((a: any) =>
            a.status === "completed"
        ).length,
        overdue: assignments.filter((a: any) =>
            a.status === "overdue"
        ).length,
    }), [assignments]);


    const filteredAssignments = assignments.filter((a: any) => {
        if (activeTab === "pending") return a.status === "assigned" || a.status === "started";
        return a.status === activeTab;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">My Challenges</h1>
                    <p className="text-default-500">Track and complete your assigned challenge</p>
                </div>
            </header>

            {/* Navigation Tabs */}
            <Tabs
                variant="underlined"
                color="primary"
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-primary font-semibold"
                }}
            >
                <Tab key="pending" title={`Pending (${counts.pending})`} />
                <Tab key="completed" title={`Completed (${counts.completed})`} />
                <Tab key="overdue" title={`Overdue (${counts.overdue})`} />
            </Tabs>

            <div className="mt-8 flex flex-col gap-4">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => <Skeleton key={i} className="rounded-xl h-32 w-full" />)
                ) : filteredAssignments.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl border-default-200">
                        <FiCheckCircle className="mx-auto text-4xl text-default-300 mb-3" />
                        <p className="text-default-500">No {activeTab} assignments found.</p>
                    </div>
                ) : (
                    filteredAssignments.map((assignment: any) => (
                        <WardAssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                            navigate={navigate}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

