import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Button,
    Card,
    CardBody,
    Avatar,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { FiPlus, FiBook, FiFolder, FiHelpCircle, FiRefreshCw } from "react-icons/fi";
import AnalyticsChart from "../Dashboard/components/AnalyticsChart";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SpinnerCircle from "../../components/Spinner/Circle";
import StatMiniCard from "./components/StatMiniCard";
import CategoryChangeModal from "./components/modals/CategoryChangeModal";
import { GuardianRoutes } from "../../routes";

export default function WardReportPage() {
    const { wardId } = useParams<{ wardId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [activeTab, setActiveTab] = useState<"test" | "exams">("test");

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: [QueryKeys.assessmentCategories],
        queryFn: async () => {
            try {
                return (await ApiSDK.AssessmentCategoriesService?.getCategoryConfigsApiV1CategoriesGet?.()) || [];
            } catch (error) {
                console.error("Failed to load categories", error);
                return [];
            }
        },
    });

    // Fetch guardian profile
    const { data: guardianData } = useQuery({
        queryKey: [QueryKeys.guardianProfile],
        queryFn: async () => {
            return ApiSDK.GuardiansService.getMyGuardianProfileApiV1GuardiansMeGet();
        },
    });

    const profile = guardianData?.data;

    // Fetch ward performance report
    const { data: reportResponse, isLoading: reportLoading } = useQuery({
        queryKey: [QueryKeys.wardReport, wardId],
        queryFn: async () => {
            return ApiSDK.GuardiansService.getWardPerformanceReportApiV1GuardiansGuardianIdWardsWardIdReportGet(
                profile?.id,
                wardId!
            );
        },
        enabled: !!profile?.id && !!wardId,
    });

    // Fetch ward detailed statistics (similar to dashboard stats)
    const { data: wardStatsResponse, isLoading: statsLoading } = useQuery({
        queryKey: [QueryKeys.wardStats, wardId],
        queryFn: async () => {
            return ApiSDK.GuardiansService.getWardDetailedStatsApiV1GuardiansGuardianIdWardsWardIdStatsGet(
                profile?.id,
                wardId!
            );
        },
        enabled: !!profile?.id && !!wardId,
    });

    // Category change mutation
    const changeCategory = useMutation({
        mutationFn: async () => {
            return ApiSDK.GuardiansService.requestCategoryChangeApiV1GuardiansGuardianIdCategoryChangesPost(
                profile!.id,
                {
                    ward_id: wardId!,
                    new_category_id: selectedCategory,
                    reason: "Guardian requested category change",
                }
            );
        },
        onSuccess: () => {
            addToast({
                title: "Successful",
                description: "Category change request submitted!",
                color: "success",
            });
            onClose();
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.wardReport],
            });
        },
        onError: () => {
            addToast({
                title: "Failed",
                description: "Unable to change category. Please try again",
                color: "danger",
            });
        },
    });

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.wardReport] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.wardStats] });
    };

    if (reportLoading || statsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <SpinnerCircle />
            </div>
        );
    }

    const report = reportResponse?.data;
    const wardStats = wardStatsResponse?.data;

    if (!report) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500">Ward not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
                <h1 className="text-md md:text-xl font-semibold text-kidemia-black">
                    {report.ward_name}'s Performance
                </h1>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <span className="text-sm md:text-base font-medium whitespace-nowrap">
                        Category:{" "}
                        <span className="text-gray-500">
                            {report.category_name || "Not Set"}
                        </span>
                    </span>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <Button
                            variant="flat"
                            color="warning"
                            className="bg-orange-100 text-orange-600 font-medium h-9 md:h-10 text-xs md:text-sm"
                            radius="sm"
                            onPress={onOpen}
                            isLoading={changeCategory.isPending}
                        >
                            Change Category
                        </Button>

                        <Button
                            variant="solid"
                            color="warning"
                            startContent={<FiPlus className="text-lg" />}
                            className="bg-orange-500 text-white font-medium h-9 md:h-10 text-xs md:text-sm"
                            radius="sm"
                            onPress={() => navigate(GuardianRoutes.createAssessment)}
                        >
                            Create Assessment
                        </Button>
                    </div>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#FFFBF3] border-none shadow-sm">
                    <CardBody className="flex flex-col items-center py-6">
                        <Avatar
                            name={report.ward_name}
                            radius="sm"
                            className="mb-2 bg-blue-400"
                        />
                        <p className="text-xs text-gray-400">Ward Name</p>
                        <h3 className="text-lg font-bold">{report.ward_name}</h3>
                    </CardBody>
                </Card>

                <StatMiniCard
                    icon={<FiBook className="text-orange-500" />}
                    title="Completed"
                    value={report.completed_assessments.toString()}
                />
                <StatMiniCard
                    icon={<FiFolder className="text-green-500" />}
                    title="Pending"
                    value={report.pending_assessments.toString()}
                />
                <StatMiniCard
                    icon={<FiHelpCircle className="text-blue-500" />}
                    title="Average Score"
                    value={`${report.avg_overall_score.toFixed(1)}%`}
                />
            </div>

            {/* Chart Section - Real Data */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Performance Analytics</h3>
                    <Button
                        size="sm"
                        variant="flat"
                        startContent={<FiRefreshCw />}
                        onPress={handleRefresh}
                    >
                        Refresh
                    </Button>
                </div>

                {wardStats ? (
                    <AnalyticsChart
                        testCategories={wardStats.test_performance_chart?.categories || []}
                        testDataSeries={wardStats.test_performance_chart?.series || []}
                        examCategories={wardStats.exam_performance_chart?.categories || []}
                        examDataSeries={wardStats.exam_performance_chart?.series || []}
                    />
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        No performance data available yet
                    </div>
                )}
            </div>

            {/* History Table with Real Data */}
            <div className="space-y-4">
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        className={activeTab === "test"
                            ? "bg-orange-500 text-white font-bold px-8"
                            : "bg-orange-200 text-orange-700 font-bold px-8"
                        }
                        onPress={() => setActiveTab("test")}
                    >
                        Test
                    </Button>
                    <Button
                        size="sm"
                        className={activeTab === "exams"
                            ? "bg-orange-500 text-white font-bold px-8"
                            : "bg-orange-200 text-orange-700 font-bold px-8"
                        }
                        onPress={() => setActiveTab("exams")}
                    >
                        Exams
                    </Button>
                </div>

                <Table aria-label="Assessment History" className="shadow-sm">
                    <TableHeader>
                        <TableColumn className="bg-orange-500 text-white">S/N</TableColumn>
                        <TableColumn className="bg-orange-500 text-white">Title</TableColumn>
                        <TableColumn className="bg-orange-500 text-white">
                            Average Score (%)
                        </TableColumn>
                        <TableColumn className="bg-orange-500 text-white">Status</TableColumn>
                        <TableColumn className="bg-orange-500 text-white">Comment</TableColumn>
                        <TableColumn className="bg-orange-500 text-white">
                            Date Created
                        </TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No assessments found">
                        {wardStats ? (
                            activeTab === "test"
                                ? wardStats.subject_history?.map((item: any) => (
                                    <TableRow key={item.attempt_id}>
                                        <TableCell>{item.sn}</TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.average_score}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={getStatusColor(item.status)}
                                                variant="flat"
                                            >
                                                {item.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>{item.comment}</TableCell>
                                        <TableCell>{item.date_created}</TableCell>
                                    </TableRow>
                                ))
                                : wardStats.exam_history?.map((item: any) => (
                                    <TableRow key={item.attempt_id}>
                                        <TableCell>{item.sn}</TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.average_score}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={getStatusColor(item.status)}
                                                variant="flat"
                                            >
                                                {item.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>{item.comment}</TableCell>
                                        <TableCell>{item.date_created}</TableCell>
                                    </TableRow>
                                ))
                        ) : []}
                    </TableBody>
                </Table>
            </div>

            {/* Category Change Modal */}
            <CategoryChangeModal
                isOpen={isOpen}
                onClose={onClose}
                currentCategory={report.category_name}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSubmit={() => changeCategory.mutate()}
                isLoading={changeCategory.isPending}
            />
        </div>
    );
}

function getStatusColor(status: string): "warning" | "success" | "danger" | "default" {
    switch (status.toLowerCase()) {
        case "pending":
            return "warning";
        case "excellent":
        case "good":
            return "success";
        case "needs improvement":
            return "danger";
        default:
            return "default";
    }
}