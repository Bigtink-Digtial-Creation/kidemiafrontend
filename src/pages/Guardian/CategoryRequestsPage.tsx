import { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    Card,
    CardBody,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { FiCheck, FiX, FiClock, FiArrowRight, FiUser } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import SpinnerCircle from "../../components/Spinner/Circle";
import CategoryApprovalModal from "./components/modals/CategoryApprovalModal";

interface CategoryChangeRequest {
    id: string;
    ward_id: string;
    old_category_id: string | null;
    new_category_id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    reason: string | null;
    requested_at: string;
    resolved_at: string | null;

    ward_name?: string;
    old_category_name?: string;
    new_category_name?: string;
}

export default function CategoryRequestsPage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const queryClient = useQueryClient();
    const [selectedRequest, setSelectedRequest] = useState<CategoryChangeRequest | null>(null);
    const [isApproving, setIsApproving] = useState(false);

    // Get guardian profile
    const { data: guardianData } = useQuery({
        queryKey: [QueryKeys.guardianProfile],
        queryFn: async () => {
            return ApiSDK.GuardiansService.getMyGuardianProfileApiV1GuardiansMeGet();
        },
    });

    const guardianId = guardianData?.data?.id;

    // Get category change requests
    const {
        data: requestsResponse,
        isLoading,
        error,
    } = useQuery({
        queryKey: [QueryKeys.categoryChangeRequests, guardianId],
        queryFn: async () => {
            if (!guardianId) throw new Error("Guardian not found");
            return ApiSDK.GuardiansService.getCategoryChangeRequestsApiV1GuardiansGuardianIdCategoryChangesGet(
                guardianId
            );
        },
        enabled: !!guardianId,
    });

    const requests = requestsResponse?.data || [];

    // Approve/reject mutation
    const approveMutation = useMutation({
        mutationFn: async ({
            requestId,
            approve,
            adminNotes,
        }: {
            requestId: string;
            approve: boolean;
            adminNotes?: string;
        }) => {
            if (!guardianId) throw new Error("Guardian ID not found");
            return ApiSDK.GuardiansService.approveCategoryChangeApiV1GuardiansGuardianIdCategoryChangesRequestIdApprovePost(
                guardianId,
                requestId,
                {
                    request_id: requestId,
                    approve: approve,
                    admin_notes: adminNotes,
                }
            );
        },
        onSuccess: (_, variables) => {
            addToast({
                title: "Success",
                description: variables.approve
                    ? "Category change approved successfully"
                    : "Category change rejected",
                color: "success",
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.categoryChangeRequests],
            });
            onClose();
        },
        onError: (error: any) => {
            addToast({
                title: "Error",
                description: error.message || "Failed to process request",
                color: "danger",
            });
        },
    });

    const handleApprovalClick = (request: CategoryChangeRequest, approve: boolean) => {
        setSelectedRequest(request);
        setIsApproving(approve);
        onOpen();
    };

    const handleConfirmApproval = (adminNotes: string) => {
        if (!selectedRequest) return;

        approveMutation.mutate({
            requestId: selectedRequest.id,
            approve: isApproving,
            adminNotes: adminNotes || undefined,
        });
    };

    const getStatusChip = (st: string) => {
        const status = st?.toUpperCase() || "PENDING";
        const statusConfig = {
            PENDING: { color: "warning" as const, icon: <FiClock />, label: "Pending" },
            APPROVED: { color: "success" as const, icon: <FiCheck />, label: "Approved" },
            REJECTED: { color: "danger" as const, icon: <FiX />, label: "Rejected" },
            CANCELLED: { color: "default" as const, icon: <FiX />, label: "Cancelled" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        return (
            <Chip
                startContent={config.icon}
                color={config.color}
                variant="flat"
                size="sm"
            >
                {config.label}
            </Chip>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <SpinnerCircle />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96 px-4 text-center">
                <div>
                    <FiX className="text-4xl text-danger mx-auto mb-2" />
                    <p className="text-danger font-medium">Failed to load category requests</p>
                    <Button size="sm" variant="light" className="mt-2" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-4 md:px-0">
                <h1 className="text-lg font-bold text-gray-800">
                    Category Change Requests
                </h1>
                <p className="text-sm text-gray-500">
                    Manage and review class category updates for your wards.
                </p>
            </div>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                    {/* Clean Iconography with Soft Backdrop */}
                    <div className="relative mb-8">
                        {/* Subtle decorative ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-100 animate-[spin_20s_linear_infinite]" />
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <FiClock className="text-5xl text-slate-200" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                            Inbox is Clear
                        </h3>
                        <p className="text-sm font-medium text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                            When category change requests are submitted, they will appear here for your approval.
                        </p>
                    </div>
                    <div className="mt-10 h-1 w-12 bg-slate-100 rounded-full" />
                </div>
            ) : (
                <div className="px-4 md:px-0">

                    {/* MOBILE LIST VIEW (Visible on small screens) */}
                    <div className="flex flex-col gap-4 md:hidden">
                        {requests.map((request: CategoryChangeRequest) => (
                            <Card key={request.id} className="shadow-sm border border-gray-100">
                                <CardBody className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <FiUser className="text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 leading-tight">
                                                    {request.ward_name || "Unknown Ward"}
                                                </h4>
                                                <p className="text-[10px] text-gray-400 font-mono uppercase">ID: {request.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                        {getStatusChip(request.status)}
                                    </div>

                                    <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                                        <div className="text-center flex-1">
                                            <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Current</p>
                                            <p className="text-xs font-semibold">{request.old_category_name || "Not Set"}</p>
                                        </div>
                                        <FiArrowRight className="text-gray-300 shrink-0" />
                                        <div className="text-center flex-1">
                                            <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Requested</p>
                                            <p className="text-xs font-bold text-primary">{request.new_category_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400 italic">
                                            {new Date(request.requested_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>

                                        {request.status?.toUpperCase() === "PENDING" && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    className="font-medium"
                                                    onPress={() => handleApprovalClick(request, false)}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="success"
                                                    className="text-white bg-kidemia-secondary font-bold shadow-sm"
                                                    onPress={() => handleApprovalClick(request, true)}
                                                >
                                                    Approve
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* DESKTOP TABLE VIEW (Visible on Medium+ screens) */}
                    <Card className="hidden md:block">
                        <CardBody className="p-0">
                            <Table aria-label="Category change requests" removeWrapper>
                                <TableHeader>
                                    <TableColumn className="bg-gray-50/50">WARD NAME</TableColumn>
                                    <TableColumn className="bg-gray-50/50">CATEGORY CHANGE</TableColumn>
                                    <TableColumn className="bg-gray-50/50">STATUS</TableColumn>
                                    <TableColumn className="bg-gray-50/50">REQUESTED ON</TableColumn>
                                    <TableColumn className="bg-gray-50/50 text-right">ACTIONS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request: CategoryChangeRequest) => (
                                        <TableRow key={request.id} className="border-b last:border-0 hover:bg-gray-50/30 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-700">{request.ward_name}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase">ID: {request.id.slice(0, 8)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-500">{request.old_category_name || "None"}</span>
                                                    <FiArrowRight className="text-gray-300" />
                                                    <span className="text-sm font-bold text-primary">{request.new_category_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusChip(request.status)}</TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(request.requested_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    {request.status?.toUpperCase() === "PENDING" ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                color="success"
                                                                variant="flat"
                                                                className="text-white bg-kidemia-secondary"
                                                                onPress={() => handleApprovalClick(request, true)}
                                                                isDisabled={approveMutation.isPending}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                color="danger"
                                                                variant="flat"
                                                                onPress={() => handleApprovalClick(request, false)}
                                                                isDisabled={approveMutation.isPending}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded">
                                                            {request.status?.toLowerCase()}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Approval Modal */}
            <CategoryApprovalModal
                isOpen={isOpen}
                onClose={onClose}
                isApproving={isApproving}
                onConfirm={handleConfirmApproval}
                isLoading={approveMutation.isPending}
            />
        </div>
    );
}