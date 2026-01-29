import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
    Select,
    SelectItem,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { FiPlus, FiTrash2, FiCreditCard, FiArrowRight, FiUsers, FiCalendar } from "react-icons/fi";
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

    const [selectedWardId, setSelectedWardId] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    // Fetch guardian profile
    const { data: guardianData } = useQuery({
        queryKey: [QueryKeys.guardianProfile],
        queryFn: async () => {
            return ApiSDK.GuardiansService.getMyGuardianProfileApiV1GuardiansMeGet();
        },
    });

    const profile = guardianData?.data;

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

    // Fetch guardian's wards
    const { data: wardsData, isLoading: wardsLoading } = useQuery({
        queryKey: [QueryKeys.myWards, profile?.id],
        queryFn: async () => {
            if (!profile?.id) return null;
            return ApiSDK.GuardiansService.getMyWardsApiV1GuardiansGuardianIdWardsGet(
                profile.id
            );
        },
        enabled: !!profile?.id,
    });

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
        mutationFn: async (data: { subscription_id: string; user_id: string }) => {
            return ApiSDK.SubscriptionsService.addMemberApiV1SubscriptionsSubscriptionIdMembersPost(
                data.subscription_id,
                { user_id: data.user_id }
            );
        },
        onSuccess: () => {
            addToast({
                title: "Success",
                description: "Ward added to subscription successfully!",
                color: "success",
            });
            setSelectedWardId("");
            onAddClose();
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subscriptionMembers] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.mysubscription] });
        },
        onError: (error: any) => {
            addToast({
                title: "Failed",
                description: error?.body?.detail || "Failed to add ward to subscription",
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
        if (!selectedWardId || !activeSubscription?.id) {
            addToast({
                title: "Error",
                description: "Please select a ward",
                color: "warning",
            });
            return;
        }

        const selectedWard = wardsData?.data?.find((w: any) => w.id === selectedWardId);
        if (!selectedWard) return;

        addMember.mutate({
            subscription_id: activeSubscription.id,
            user_id: selectedWard.user_id,
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
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
                <div className="text-center space-y-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                            <FiCreditCard className="text-4xl text-orange-500" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            No Active Subscription
                        </h1>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Subscribe to a plan to add wards to your subscription and share benefits with your family.
                        </p>
                    </div>

                    {/* Action */}
                    <Button
                        size="lg"
                        className="bg-orange-500 text-white font-semibold px-8"
                        endContent={<FiArrowRight />}
                        onPress={() => navigate(PaymentRoutes.subscriptionUpgrade)}
                    >
                        View Plans
                    </Button>
                </div>
            </div>
        );
    }

    const members = membersData?.data?.members || [];
    const wards = wardsData?.data || [];
    const canAddMore = activeSubscription.max_members
        ? activeSubscription.current_members < activeSubscription.max_members
        : true;

    // Enrich members with ward data
    const enrichedMembers = members.map((member: any) => {
        const ward = wards.find((w: any) => w.user_id === member.user_id);
        return {
            ...member,
            full_name: ward?.full_name || "Unknown",
            email: ward?.email || "N/A",
            is_owner: member.role === "owner",
        };
    });

    // Filter wards that are not already members
    const availableWards = wards.filter(
        (ward: any) => !members.some((member: any) => member.user_id === ward.user_id)
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        Subscription Members
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Add wards to share subscription benefits
                    </p>
                </div>

                <Button
                    size="sm"
                    variant="light"
                    className="text-orange-500 font-medium self-start sm:self-auto"
                    endContent={<FiArrowRight className="text-sm" />}
                    onPress={() => navigate(PaymentRoutes.subscriptionUpgrade)}
                >
                    Manage Subscription
                </Button>
            </div>

            {/* Subscription Info - Clean Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-gray-200">
                <div className="flex items-center gap-3">
                    <FiCreditCard className="text-xl text-orange-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Plan</p>
                        <p className="font-semibold text-gray-900 capitalize">
                            {activeSubscription.plan_code.replace(/_/g, " ")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <FiUsers className="text-xl text-blue-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Members</p>
                        <p className="font-semibold text-gray-900">
                            {activeSubscription.current_members} / {activeSubscription.max_members || "∞"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <FiCalendar className="text-xl text-green-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Next Billing</p>
                        <p className="font-semibold text-gray-900">
                            {new Date(activeSubscription.next_billing_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Member Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Current Members</h2>
                <Button
                    size="sm"
                    className="bg-orange-500 text-white font-medium"
                    startContent={<FiPlus />}
                    onPress={onAddOpen}
                    isDisabled={!canAddMore || availableWards.length === 0}
                >
                    Add Ward
                </Button>
            </div>

            {/* Limit Warning */}
            {!canAddMore && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    You've reached the maximum number of members for your plan. Upgrade to add more.
                </div>
            )}

            {availableWards.length === 0 && canAddMore && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    All your wards are already added to the subscription. Add more wards from your dashboard first.
                </div>
            )}

            {/* Members Table - Mobile Responsive */}
            {membersLoading ? (
                <div className="flex justify-center py-12">
                    <SpinnerCircle />
                </div>
            ) : enrichedMembers.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No members yet. Add your wards to get started.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <Table
                            aria-label="Subscription members"
                            removeWrapper
                            className="border border-gray-200 rounded-lg"
                        >
                            <TableHeader>
                                <TableColumn className="bg-gray-50 text-xs font-semibold">NAME</TableColumn>
                                <TableColumn className="bg-gray-50 text-xs font-semibold hidden sm:table-cell">EMAIL</TableColumn>
                                <TableColumn className="bg-gray-50 text-xs font-semibold">ROLE</TableColumn>
                                <TableColumn className="bg-gray-50 text-xs font-semibold hidden md:table-cell">JOINED</TableColumn>
                                <TableColumn className="bg-gray-50 text-xs font-semibold">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {enrichedMembers.map((member: any) => (
                                    <TableRow key={member.id} className="border-b border-gray-100 last:border-0">
                                        <TableCell className="py-3">
                                            <div>
                                                <p className="font-medium text-sm">{member.full_name}</p>
                                                <p className="text-xs text-gray-500 sm:hidden">{member.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-sm">{member.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={member.is_owner ? "warning" : "default"}
                                                variant="flat"
                                                className="text-xs"
                                            >
                                                {member.is_owner ? "Owner" : "Ward"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-sm text-gray-600">
                                            {new Date(member.joined_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {!member.is_owner && (
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    isIconOnly
                                                    onPress={() => openRemoveModal(member.id)}
                                                >
                                                    <FiTrash2 className="text-base" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Add Ward Modal */}
            <Modal isOpen={isAddOpen} onClose={onAddClose} size="md">
                <ModalContent>
                    <ModalHeader>Add Ward to Subscription</ModalHeader>
                    <ModalBody>
                        {wardsLoading ? (
                            <div className="flex justify-center py-8">
                                <SpinnerCircle />
                            </div>
                        ) : (
                            <>
                                <Select
                                    label="Select Ward"
                                    placeholder="Choose a ward to add"
                                    selectedKeys={selectedWardId ? [selectedWardId] : []}
                                    onChange={(e) => setSelectedWardId(e.target.value)}
                                    variant="bordered"
                                    isRequired
                                >
                                    {availableWards.map((ward: any) => (
                                        <SelectItem key={ward.id} textValue={ward.full_name}>
                                            {ward.full_name} ({ward.email})
                                        </SelectItem>
                                    ))}
                                </Select>
                                <p className="text-sm text-gray-500">
                                    Adding a ward to your subscription gives them access to all subscription benefits.
                                </p>
                            </>
                        )}
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
                            Add Ward
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