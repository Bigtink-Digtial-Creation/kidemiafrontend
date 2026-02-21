import { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Avatar,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Select,
    SelectItem,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { FiPlus, FiAlertCircle, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GuardianRoutes } from "../../routes";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import SpinnerCircle from "../../components/Spinner/Circle";
import { AccessDeniedModal } from "../../components/AccessDeniedModal";

interface Ward {
    id: string;
    full_name: string;
    email: string;
    category_name: string | null;
    avg_exam_score: number | null;
    avg_test_score: number | null;
    is_active: boolean;
    total_assessments: number;
}

export default function GuardianDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [paymentModal, setPaymentModal] = useState<{
        isOpen: boolean;
        type: "subscription" | "token" | "general";
        message?: string;
    }>({ isOpen: false, type: "subscription" });
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [wardEmail, setWardEmail] = useState("");
    const [relationshipType, setRelationshipType] = useState("parent");
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

    const {
        data: guardianData,
        isLoading: guardianLoading,
        error: guardianError,
    } = useQuery({
        queryKey: [QueryKeys.guardianProfile],
        queryFn: async () => {
            return ApiSDK.GuardiansService.getMyGuardianProfileApiV1GuardiansMeGet();
        },
    });

    const guardian = guardianData?.data;

    const {
        data: wardsData,
        isLoading: wardsLoading,
    } = useQuery({
        queryKey: [QueryKeys.guardianProfile, guardian?.id],
        enabled: !!guardian?.id,
        queryFn: async () => {
            return ApiSDK.GuardiansService.getMyWardsApiV1GuardiansGuardianIdWardsGet(
                guardian!.id
            );
        },
    });

    const wards = wardsData?.data;

    /**
     * Add Ward Mutation
     */
    const { mutate: addWard, isPending: addingWard } = useMutation({
        mutationFn: async () => {
            return ApiSDK.GuardiansService.addWardApiV1GuardiansGuardianIdWardsPost(
                guardian!.id,
                {
                    ward_email: wardEmail,
                    relationship_type: relationshipType,
                }
            );
        },
        onSuccess: () => {
            addToast({
                title: "Successful",
                description: "Ward Invitation sent successfully!",
                color: "success",
            });
            setWardEmail("");
            setRelationshipType("parent");
            onAddClose();
            queryClient.invalidateQueries({ queryKey: [QueryKeys.guardianProfile] });
        },
        onError: (error: any) => {
            const body = error.body;

            if (error.status === 402 && body?.detail && typeof body.detail === "object") {
                const detail = body.detail;
                const message =
                    detail.reason ||
                    detail.upgrade_suggestion ||
                    "You don't have access to perform this action.";

                // Determine modal type based on the method field or reason
                const type =
                    detail.method === "token" ? "token" : "subscription";

                setPaymentModal({ isOpen: true, type, message });
                return;
            }

            // Non-402 errors fall back to toast
            const description =
                (typeof body?.detail === "string" && body.detail) ||
                body?.message ||
                error.message ||
                "Failed to Invite Ward";

            addToast({
                title: "Failed",
                description,
                color: "danger",
            });
        },
    });

    /**
     * Remove Ward Mutation
     */
    const { mutate: removeWard, isPending: removingWard } = useMutation({
        mutationFn: async (wardId: string) => {
            return ApiSDK.GuardiansService.removeWardApiV1GuardiansGuardianIdWardsDelete(
                guardian!.id,
                { ward_id: wardId }
            );
        },
        onSuccess: () => {
            addToast({
                title: "Removed",
                description: "Ward has been removed from your profile.",
                color: "success",
            });
            onDeleteClose();
            queryClient.invalidateQueries({ queryKey: [QueryKeys.guardianProfile] });
        },
        onError: (error: any) => {
            addToast({
                title: "Error",
                description: error?.body?.detail || "Failed to remove ward",
                color: "danger",
            });
        },
    });

    const handleDeleteClick = (ward: Ward) => {
        setSelectedWard(ward);
        onDeleteOpen();
    };

    if (guardianLoading || wardsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <SpinnerCircle />
            </div>
        );
    }

    if (guardianError) {
        return (
            <div className="text-center py-20 text-red-500">
                Failed to load guardian dashboard
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-kidemia-black">Your Wards</h1>
                <Button
                    color="warning"
                    variant="solid"
                    startContent={<FiPlus />}
                    // Adjusted size to be more prominent
                    size="lg"
                    className="bg-orange-500 text-white font-bold px-8"
                    radius="sm"
                    onPress={onAddOpen}
                >
                    Add Ward
                </Button>
            </div>

            {!wards || wards.length === 0 ? (
                <Card className="border-none shadow-sm">
                    <CardBody className="flex flex-col items-center justify-center py-16 text-center">
                        <FiAlertCircle className="text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Wards Yet</h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                            You haven't added any wards yet. Click the "Add Ward" button to get
                            started and begin monitoring their progress.
                        </p>
                        <Button
                            color="warning"
                            variant="solid"
                            startContent={<FiPlus />}
                            className="bg-orange-500 text-white font-medium"
                            radius="sm"
                            onPress={onAddOpen}
                        >
                            Add Your First Ward
                        </Button>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wards.map((ward: Ward) => (
                        <Card key={ward.id} className="border-none shadow-sm bg-[#FFFBF3] py-4">
                            <CardBody className="flex flex-col items-center text-center space-y-4">
                                <div className="bg-blue-100 p-1 rounded-lg">
                                    <Avatar
                                        name={ward.full_name}
                                        className="w-16 h-16 text-large bg-blue-400"
                                        radius="sm"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-kidemia-black">{ward.full_name}</h3>
                                    {ward.category_name && (
                                        <p className="text-xs text-gray-500 mb-2">{ward.category_name}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Avg. Exam: {ward.avg_exam_score ? `${ward.avg_exam_score}%` : "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Avg. Test: {ward.avg_test_score ? `${ward.avg_test_score}%` : "N/A"}
                                    </p>
                                </div>

                                <div className="flex flex-col w-full gap-2 px-4">
                                    <Button
                                        onPress={() => navigate(GuardianRoutes.wardReport.replace(":wardId", ward.id))}
                                        className="bg-orange-500 text-white w-full font-medium"
                                        radius="sm"
                                        size="md"
                                    >
                                        View Ward
                                    </Button>
                                    <Button
                                        onPress={() => handleDeleteClick(ward)}
                                        variant="light"
                                        color="danger"
                                        startContent={<FiTrash2 />}
                                        className="w-full font-medium"
                                        radius="sm"
                                        size="sm"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Ward Modal */}
            <Modal isOpen={isAddOpen} onClose={onAddClose} size="md">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Add New Ward</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Ward Email"
                            placeholder="Enter student's email"
                            type="email"
                            value={wardEmail}
                            onChange={(e) => setWardEmail(e.target.value)}
                            variant="bordered"
                            isRequired
                        />
                        <Select
                            label="Relationship Type"
                            placeholder="Select your relationship"
                            selectedKeys={[relationshipType]}
                            onChange={(e) => setRelationshipType(e.target.value)}
                            variant="bordered"
                        >
                            <SelectItem key="parent" textValue="parent">Parent</SelectItem>
                            <SelectItem key="guardian" textValue="guardian">Guardian</SelectItem>
                            <SelectItem key="sponsor" textValue="sponsor">Sponsor</SelectItem>
                            <SelectItem key="mentor" textValue="mentor">Mentor</SelectItem>
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="flat" onPress={onAddClose}>Cancel</Button>
                        <Button
                            color="warning"
                            className="bg-orange-500 text-white"
                            onPress={() => addWard()}
                            isLoading={addingWard}
                        >
                            Add Ward
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Confirmation Modal for Removal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
                <ModalContent>
                    <ModalHeader>Confirm Removal</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to remove <b>{selectedWard?.full_name}</b> from your wards? This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onDeleteClose}>Cancel</Button>
                        <Button
                            color="danger"
                            isLoading={removingWard}
                            onPress={() => selectedWard && removeWard(selectedWard.id)}
                        >
                            Confirm Remove
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AccessDeniedModal
                isOpen={paymentModal.isOpen}
                onClose={() => setPaymentModal((prev) => ({ ...prev, isOpen: false }))}
                type={paymentModal.type}
                message={paymentModal.message}
            />
        </div>
    );
}