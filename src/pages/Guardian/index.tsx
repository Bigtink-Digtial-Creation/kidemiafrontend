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
import { FiPlus, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GuardianRoutes } from "../../routes";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import SpinnerCircle from "../../components/Spinner/Circle";

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
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [wardEmail, setWardEmail] = useState("");
    const [relationshipType, setRelationshipType] = useState("parent");


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

    const wards = wardsData?.data

    /**
     * -----------------------------
     * Add Ward Mutation
     * -----------------------------
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
                description: "Ward added successfully!",
                color: "success",
            });
            setWardEmail("");
            setRelationshipType("parent");
            onClose();
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.guardianProfile],
            });
        },
        onError: (error: any) => {
            addToast({
                title: "Fail",
                description: error?.body?.detail || "Failed to add ward",
                color: "danger",
            });
        },
    });

    if (guardianLoading || wardsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                < SpinnerCircle />
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
                    className="bg-orange-500 text-white font-medium px-6"
                    radius="sm"
                    onPress={onOpen}
                >
                    Add Ward
                </Button>
            </div>

            {!wards || wards.length === 0 ? (
                <Card className="border-none shadow-sm">
                    <CardBody className="flex flex-col items-center justify-center py-16 text-center">
                        <FiAlertCircle className="text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            No Wards Yet
                        </h3>
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
                            onPress={onOpen}
                        >
                            Add Your First Ward
                        </Button>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wards.map((ward: Ward) => (
                        <Card
                            key={ward.id}
                            className="border-none shadow-sm bg-[#FFFBF3] py-4"
                        >
                            <CardBody className="flex flex-col items-center text-center space-y-4">
                                <div className="bg-blue-100 p-1 rounded-lg">
                                    <Avatar
                                        name={ward.full_name}
                                        className="w-16 h-16 text-large bg-blue-400"
                                        radius="sm"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-kidemia-black">
                                        {ward.full_name}
                                    </h3>
                                    {ward.category_name && (
                                        <p className="text-xs text-gray-500 mb-2">
                                            {ward.category_name}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Avg. Exam:{" "}
                                        {ward.avg_exam_score
                                            ? `${ward.avg_exam_score}%`
                                            : "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Avg. Test:{" "}
                                        {ward.avg_test_score
                                            ? `${ward.avg_test_score}%`
                                            : "N/A"}
                                    </p>
                                </div>

                                <Button
                                    onPress={() =>
                                        navigate(GuardianRoutes.wardReport.replace(":wardId", ward!.id))
                                    }
                                    className="bg-orange-500 text-white w-32 font-medium"
                                    radius="sm"
                                    size="md"
                                >
                                    View Ward
                                </Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Ward Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Add New Ward
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Ward Email"
                            placeholder="Enter student's email address"
                            type="email"
                            value={wardEmail}
                            onChange={(e) => setWardEmail(e.target.value)}
                            variant="bordered"
                            isRequired
                        />

                        <Select
                            label="Relationship Type"
                            placeholder="Select your relationship"
                            value={relationshipType}
                            onChange={(e) => setRelationshipType(e.target.value)}
                            variant="bordered"
                        >
                            <SelectItem key="parent" textValue="parent">
                                Parent
                            </SelectItem>
                            <SelectItem key="guardian" textValue="guardian">
                                Guardian
                            </SelectItem>
                            <SelectItem key="sponsor" textValue="sponsor">
                                Sponsor
                            </SelectItem>
                            <SelectItem key="mentor" textValue="mentor">
                                Mentor
                            </SelectItem>
                        </Select>

                        <p className="text-sm text-gray-500">
                            The student must already be registered with this email address.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="flat" onPress={onClose}>
                            Cancel
                        </Button>
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
        </div>
    );
}
