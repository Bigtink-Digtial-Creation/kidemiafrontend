import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Card,
    CardBody,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { FiPlus, FiTrash2, FiUsers, FiCreditCard, FiCalendar } from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { useNavigate } from "react-router";
import SpinnerCircle from "../../components/Spinner/Circle";
import { PaymentRoutes } from "../../routes";

export default function GuardianSubscriptionPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();

    const [memberEmail, setMemberEmail] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    // Fetch subscription data
    const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
        queryKey: [QueryKeys.mysubscription],
        queryFn: async () => {
            return ApiSDK.SubscriptionsService.getMySubscriptionsApiV1SubscriptionsGet();
        },
    });

    const activeSubscription = subscriptionsData?.data?.find(
        (sub: any) => sub.status === "active"
    );

    // Fetch subscription members
    const { data: membersData, isLoading: membersLoading } = useQuery({
        queryKey: [QueryKeys.subscriptionMembers, activeSubscription?.id],
        queryFn: async () => {
            if (!activeSubscription?.id) return null;
            return ApiSDK.SubscriptionsService.getSubscriptionApiV1SubscriptionsSubscriptionIdGet(
                activeSubscription.id
            );
        },
        enabled: !!activeSubscription?.id,
    });

    // Add member mutation
    const addMember = useMutation({
        mutationFn: async (data: { subscription_id: string; member_id: string }) => {
            return ApiSDK.SubscriptionsService.addMemberApiV1SubscriptionsSubscriptionIdMembersPost(
                data.subscription_id,
                { user_id: data.member_id }
            );
        },
        onSuccess: () => {
            addToast({
                title: "Success",
                description: "Member added to subscription successfully!",
                color: "success",
            });
            setSelectedMemberId(null);
            onAddClose();
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subscriptionMembers] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.mysubscription] });
        },
        onError: (error: any) => {
            addToast({
                title: "Failed",
                description: error?.body?.detail || "Failed to add member",
                color: "danger",
            });
        },
    });

    // Remove member mutation
    const removeMember = useMutation({
        mutationFn: async (data: { subscription_id: string; member_id: string }) => {
            return ApiSDK.SubscriptionsService.removeMemberApiV1SubscriptionsSubscriptionIdMembersDelete(
                data.subscription_id,
                { member_id: data.member_id }
            );
        },
        onSuccess: () => {
            addToast({
                title: "Success",
                description: "Member removed from subscription",
                color: "success",
            });
            setSelectedMemberId(null);
            onRemoveClose();
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subscriptionMembers] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.mysubscription] });
        },
        onError: (error: any) => {
            addToast({
                title: "Failed",
                description: error?.body?.detail || "Failed to remove member",
                color: "danger",
            });
        },
    });

    const handleAddMember = () => {
        if (!selectedMemberId || !activeSubscription?.id) return;

        addMember.mutate({
            subscription_id: activeSubscription.id,
            member_id: selectedMemberId,
        });
    };

    const handleRemoveMember = () => {
        if (!selectedMemberId || !activeSubscription?.id) return;

        removeMember.mutate({
            subscription_id: activeSubscription.id,
            member_id: selectedMemberId,
        });
    };

    const openRemoveModal = (memberId: string) => {
        setSelectedMemberId(memberId);
        onRemoveOpen();
    };

    if (subscriptionsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <SpinnerCircle />
            </div>
        );
    }

    if (!activeSubscription) {
        return (
            <div className="space-y-6">
                <h1 className="text-xl font-semibold text-kidemia-black">
                    Subscription Management
                </h1>
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
                    {/* Minimalist Icon with subtle background pulse */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-orange-100 rounded-full blur-2xl opacity-40 scale-150" />
                        <div className="relative w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                            <FiCreditCard className="text-3xl text-slate-400" />
                        </div>
                    </div>

                    {/* Typography - Clean & High Density */}
                    <div className="max-w-sm mx-auto">
                        <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
                            Subscription Required
                        </h3>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">
                            To manage your wards and access advanced analytics, please choose a plan that fits your family's needs.
                        </p>
                    </div>

                    {/* Action - Brand Focused */}
                    <Button
                        className="h-12 px-10 bg-kidemia-secondary text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:scale-105 transition-transform"
                        onPress={() => navigate(PaymentRoutes.subscriptionUpgrade)}
                    >
                        Explore Premium Plans
                    </Button>

                    <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Kidemia Academic Suite
                    </p>
                </div>
            </div>
        );
    }

    const members = membersData?.data?.members || [];
    const canAddMore = activeSubscription.max_members
        ? activeSubscription.current_members < activeSubscription.max_members
        : true;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-kidemia-black">
                        Subscription Management
                    </h1>
                    <p className="text-gray-500">
                        Manage members on your subscription plan
                    </p>
                </div>
            </div>

            {/* Subscription Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardBody className="flex flex-row items-center gap-4">
                        <FiCreditCard className="text-3xl text-orange-500" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Plan</p>
                            <h3 className="text-xl font-bold capitalize">
                                {activeSubscription.plan_code.replace(/_/g, " ")}
                            </h3>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="flex flex-row items-center gap-4">
                        <FiUsers className="text-3xl text-blue-500" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Members</p>
                            <h3 className="text-xl font-bold">
                                {activeSubscription.current_members} /{" "}
                                {activeSubscription.max_members || "∞"}
                            </h3>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="flex flex-row items-center gap-4">
                        <FiCalendar className="text-3xl text-green-500" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Next Billing</p>
                            <h3 className="text-lg font-bold">
                                {new Date(
                                    activeSubscription.next_billing_date
                                ).toLocaleDateString()}
                            </h3>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Members Table */}
            <Card>
                <CardBody>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Subscription Members</h3>
                        <Button
                            color="warning"
                            className="bg-orange-500 text-white"
                            startContent={<FiPlus />}
                            onPress={onAddOpen}
                            isDisabled={!canAddMore}
                        >
                            Add Member
                        </Button>
                    </div>

                    {!canAddMore && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                            You've reached the maximum number of members for your plan.
                            Upgrade to add more members.
                        </div>
                    )}

                    {membersLoading ? (
                        <div className="flex justify-center py-8">
                            <SpinnerCircle />
                        </div>
                    ) : (
                        <Table aria-label="Subscription members">
                            <TableHeader>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>ROLE</TableColumn>
                                <TableColumn>JOINED</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="No members found">
                                {members.map((member: any) => (
                                    <TableRow key={member.id}>
                                        <TableCell>{member.full_name || "N/A"}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={member.is_owner ? "warning" : "default"}
                                                variant="flat"
                                            >
                                                {member.is_owner ? "Owner" : "Member"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(member.joined_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {!member.is_owner && (
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    startContent={<FiTrash2 />}
                                                    onPress={() => openRemoveModal(member.id)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            {/* Add Member Modal */}
            <Modal isOpen={isAddOpen} onClose={onAddClose} size="md">
                <ModalContent>
                    <ModalHeader>Add Member to Subscription</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Member Email"
                            placeholder="Enter email address"
                            type="email"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            variant="bordered"
                            isRequired
                        />
                        <p className="text-sm text-gray-500">
                            The member must already be registered as a student/ward.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="flat" onPress={onAddClose}>
                            Cancel
                        </Button>
                        <Button
                            color="warning"
                            className="bg-orange-500 text-white"
                            onPress={handleAddMember}
                            isLoading={addMember.isPending}
                        >
                            Add Member
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Remove Member Modal */}
            <Modal isOpen={isRemoveOpen} onClose={onRemoveClose} size="md">
                <ModalContent>
                    <ModalHeader>Remove Member</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to remove this member from your subscription?</p>
                        <p className="text-sm text-gray-500 mt-2">
                            They will lose access to subscription benefits immediately.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="flat" onPress={onRemoveClose}>
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleRemoveMember}
                            isLoading={removeMember.isPending}
                        >
                            Remove Member
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}