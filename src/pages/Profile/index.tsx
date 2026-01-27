import { ProfileSchema } from "../../schema/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserUpdate } from "../../sdk/generated";
import { apiErrorParser } from "../../utils/errorParser";
import SpinnerCircle from "../../components/Spinner/Circle";
import { loggedinUserAtom } from "../../store/user.atom";
import { useAtom, useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { useInvalidateQueries } from "../../hooks/use-invalidate-queries";
import { QueryKeys } from "../../utils/queryKeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    addToast,
    Avatar,
    Input,
    Button,
    useDisclosure,
    Select,
    SelectItem,
} from "@heroui/react";
import { ApiSDK } from "../../sdk";
import ProfileRow from "./components/ProfileRow";
import { useEffect, useState } from "react";
import { getNameIntials } from "../../utils";
import ProfileAvatarModal from "./components/ProfileAvatarModal";
import ChangePasswordModal from "./components/ChangePasswordModal";

export default function ProfilePage() {
    const avatarModal = useDisclosure();
    const passwordModal = useDisclosure();
    const storedUser = useAtomValue(loggedinUserAtom);
    const [_, setStoredUser] = useAtom(loggedinUserAtom);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const roleName = storedUser?.user?.roles?.[0].name;
    const isStudent = roleName === "student";

    const form = useForm<ProfileSchema>({
        resolver: zodResolver(ProfileSchema),
    });

    const { data: user, isLoading } = useQuery({
        queryKey: [QueryKeys.user],
        queryFn: () => ApiSDK.UsersService.getUserApiV1UsersUserIdGet(storedUser?.user?.id as string),
    });

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: [QueryKeys.categories],
        queryFn: () => ApiSDK.AssessmentCategoriesService.getCategoryConfigsApiV1CategoriesGet(),
        enabled: isStudent,
    });

    // Simplified status tracking: Fetch only the latest request
    const { data: latestRequest } = useQuery({
        queryKey: ["latest-category-request", user?.student?.id],
        queryFn: () => ApiSDK.GuardiansService.getLatestCategoryChangeApiV1GuardiansLatestCategoryChangeWardIdGet(
            user?.student?.id as string
        ),
        enabled: isStudent && !!user?.student?.id,
    });

    const requestStatus = latestRequest?.data?.status;
    const hasPendingRequest = requestStatus === "pending";

    const { data: guardianData } = useQuery({
        queryKey: [QueryKeys.guardianProfile, user?.student?.guardian_id],
        queryFn: () => ApiSDK.GuardiansService.getGuardianDetailApiV1GuardiansGuardianIdGet(user!.student!.guardian_id!),
        enabled: isStudent && !!user?.student?.guardian_id,
    });

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        setAvatarUrl(user.profile_picture_url ?? null);
        setSelectedCategory(user.student?.category_id ?? "");

        form.reset({
            first_name: user.first_name ?? "",
            middle_name: user.middle_name ?? "",
            last_name: user.last_name ?? "",
            bio: user.bio ?? "",
            date_of_birth: user.date_of_birth ?? "",
            phone_number: user.phone_number ?? "",
        });
    }, [user]);

    const invalidateQueries = useInvalidateQueries();

    const updateProfile = useMutation({
        mutationFn: (data: UserUpdate) =>
            ApiSDK.AuthenticationService.updateAccountApiV1AuthAccountUserIdPatch(user!.id, data),
        onSuccess() {
            invalidateQueries([QueryKeys.user]);
            addToast({ color: "success", description: "Changes saved successfully" });
        },
        onError(error) {
            addToast({ color: "danger", description: apiErrorParser(error).message });
        },
    });

    const currentCategoryName = categoriesData?.find(c => c.id === (selectedCategory || user?.student?.category_id))?.display_name
        || user?.student?.category?.display_name;

    const updateCategoryMutation = useMutation({
        mutationFn: async (categoryId: string) => {
            return ApiSDK.GuardiansService.updateStudentCategoryApiV1GuardiansRequestCategoryUpdatePost({
                ward_id: user?.student?.id!,
                new_category_id: categoryId,
                reason: "New change request"
            });
        },
        onSuccess(response: any) {
            const data = response.data;
            if (data.auto_updated) {
                addToast({ color: "success", description: data.message });
                if (storedUser?.user?.student) {
                    const updatedUser = {
                        ...storedUser,
                        user: {
                            ...storedUser.user,
                            student: {
                                ...storedUser.user.student,
                                category_id: selectedCategory,
                                category: categoriesData?.find(c => c.id === selectedCategory)
                            }
                        }
                    };
                    setStoredUser(updatedUser);
                }
                invalidateQueries([QueryKeys.user]);
            } else {
                addToast({ color: "primary", description: data.message });
                invalidateQueries(["latest-category-request"]);
            }
        },
        onError(error) {
            addToast({ color: "danger", description: apiErrorParser(error).message });
        },
    });

    const uploadAvatarMutation = useMutation({
        mutationFn: async (file: File) => {
            const response = await ApiSDK.UploadService.updateAvatarApiV1ApiUploadAccountAvatarPatch({ file });
            return response;
        },
        onSuccess: (response) => {
            updateProfile.mutate({ profile_picture_url: response.url });
            setAvatarUrl(response.url);
            avatarModal.onClose();
            addToast({ color: "success", description: "Profile picture updated" });
        },
        onError: (error: any) => {
            addToast({ color: "danger", description: error?.body?.detail || "Upload failed" });
        },
    });

    const handleCategoryUpdate = () => {
        if (!selectedCategory) return;
        if (selectedCategory === user?.student?.category_id) {
            addToast({ color: "warning", description: "This is already your current category" });
            return;
        }
        updateCategoryMutation.mutate(selectedCategory);
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <SpinnerCircle color="#f97316" />
            </div>
        );
    }

    const fullName = [user?.first_name, user?.middle_name, user?.last_name].filter(Boolean).join(" ");

    return (
        <>
            <div className="min-h-[100dvh] w-full flex justify-center px-4 py-6">
                <div className="w-full max-w-3xl rounded-2xl bg-gray-50/80 backdrop-blur-md px-6 py-8 shadow-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <Avatar
                                src={avatarUrl ?? undefined}
                                className="w-28 h-28 text-3xl cursor-pointer"
                                isBordered
                                name={getNameIntials(fullName) as string}
                                onClick={avatarModal.onOpen}
                            />
                            {uploadAvatarMutation.isPending && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <button onClick={avatarModal.onOpen} className="text-sm text-kidemia-secondary">
                            Tap to <span className="text-kidemia-primary font-medium">upload</span> picture
                        </button>
                    </div>

                    <ProfileAvatarModal
                        isOpen={avatarModal.isOpen}
                        onClose={avatarModal.onClose}
                        onSave={(file) => uploadAvatarMutation.mutate(file)}
                        isUploading={uploadAvatarMutation.isPending}
                    />

                    <div className="mt-8 space-y-4">
                        {([
                            ["First Name", "first_name"],
                            ["Middle Name", "middle_name"],
                            ["Last Name", "last_name"],
                            ["Bio", "bio"],
                            ["Date of Birth", "date_of_birth", "date"],
                            ["Phone Number", "phone_number"],
                        ] as const).map(([label, field, type]) => (
                            <ProfileRow key={field} label={label} value={(user as any)?.[field] || "-"}>
                                <Input type={type ?? "text"} variant="underlined" {...form.register(field)} />
                            </ProfileRow>
                        ))}

                        <ProfileRow label="Email" value={user?.email} disabled />

                        {isStudent && (
                            <>
                                <ProfileRow
                                    label="Category"
                                    value={currentCategoryName}
                                    status={requestStatus as any}
                                    isUpdating={updateCategoryMutation.isPending}
                                    onUpdate={handleCategoryUpdate}
                                    helperText={
                                        hasPendingRequest
                                            ? `Requested change to: ${latestRequest?.data?.new_category_name}`
                                            : "You can update your learning category here"
                                    }
                                >
                                    <Select
                                        variant="underlined"
                                        aria-label="Select Category"
                                        selectedKeys={selectedCategory ? [selectedCategory] : []}
                                        onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                                        isLoading={categoriesLoading}
                                        isDisabled={hasPendingRequest}
                                    >
                                        {(categoriesData || []).map((cat) => (
                                            <SelectItem key={cat.id} textValue={cat.display_name}>
                                                {cat.display_name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </ProfileRow>

                                <ProfileRow
                                    label="Guardian Email"
                                    value={user?.student?.guardian_email ?? "-"}
                                    helperText={guardianData ? `Guardian: ${guardianData.full_name}` : ""}
                                >
                                    <Input variant="underlined" defaultValue={user?.student?.guardian_email || ""} />
                                </ProfileRow>
                            </>
                        )}

                        <div className="pt-8 flex flex-col gap-4">
                            <Button className="bg-kidemia-primary text-white" isLoading={updateProfile.isPending} onPress={() => updateProfile.mutate(form.getValues())} size="lg">
                                Save Changes
                            </Button>
                            <Button variant="light" onPress={passwordModal.onOpen} size="lg">Change Password</Button>
                        </div>
                    </div>
                </div>
            </div>
            <ChangePasswordModal isOpen={passwordModal.isOpen} onClose={passwordModal.onClose} />
        </>
    );
}