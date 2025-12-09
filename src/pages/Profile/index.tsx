import { ProfileSchema } from "../../schema/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserUpdate } from "../../sdk/generated";
import { apiErrorParser } from "../../utils/errorParser";
import SpinnerCircle from "../../components/Spinner/Circle";
import { loggedinUserAtom } from "../../store/user.atom";
import { useAtomValue } from "jotai";
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
import { uploadToGCS } from "../../services/storage/uploadToGCS";
import ProfileAvatarModal from "./components/ProfileAvatarModal";
import ChangePasswordModal from "./components/ChangePasswordModal";

export default function ProfilePage() {
    const avatarModal = useDisclosure();
    const passwordModal = useDisclosure();

    const mockUpdateUserCategoryApi = (
        userId: string,
        payload: { category: string }
    ) =>
        new Promise<{ category: string; status: "pending" }>((resolve) => {
            console.log("MOCK category update:", userId, payload);
            setTimeout(() => {
                resolve({
                    category: payload.category,
                    status: "pending",
                });
            }, 1200);
        });

    const storedUser = useAtomValue(loggedinUserAtom);

    const form = useForm<ProfileSchema>({
        resolver: zodResolver(ProfileSchema),
    });

    const { data: user, isLoading } = useQuery({
        queryKey: [QueryKeys.user],
        queryFn: () =>
            ApiSDK.UsersService.getUserApiV1UsersUserIdGet(
                storedUser?.user?.id as string,
            ),
    });

    const {
        data: categoriesData,
        isLoading: categoriesLoading,
    } = useQuery({
        queryKey: [QueryKeys.categories],
        queryFn: async () => {
            return ApiSDK.AssessmentCategoriesService.getCategoryConfigsApiV1CategoriesGet();
        },
    });

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    useEffect(() => {
        if (!user) return;

        setAvatarUrl(user.profile_picture_url ?? null);
        setSelectedCategory(user.student?.category?.category_name ?? "");

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
            ApiSDK.AuthenticationService.updateAccountApiV1AuthAccountUserIdPatch(
                user!.id,
                data,
            ),
        onSuccess() {
            invalidateQueries([QueryKeys.user]);
            addToast({ color: "success", description: "Changes saved successfully" });
        },
        onError(error) {
            addToast({
                color: "danger",
                description: apiErrorParser(error).message,
            });
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: (category: string) =>
            mockUpdateUserCategoryApi(user!.id, { category }),
        // Replace with actual API call when ready:
        // ApiSDK.UsersService.updateUserCategoryApiV1UsersCategoryPatch(
        //   user!.id,
        //   { category },
        // ),
        onSuccess() {
            addToast({
                color: "success",
                description: "Category change submitted for approval",
            });
            invalidateQueries([QueryKeys.user]);
        },
        onError(error) {
            addToast({
                color: "danger",
                description: apiErrorParser(error).message,
            });
        },
    });

    const handleCategoryUpdate = () => {
        if (!selectedCategory) {
            addToast({
                color: "warning",
                description: "Please select a category",
            });
            return;
        }
        updateCategoryMutation.mutate(selectedCategory);
    };

    const handleAvatarUpload = async (file: File) => {
        try {
            const imageUrl = await uploadToGCS(file);
            updateProfile.mutate({ profile_picture_url: imageUrl });
            setAvatarUrl(imageUrl);
            avatarModal.onClose();
        } catch {
            addToast({ color: "danger", description: "Upload failed" });
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <SpinnerCircle color="#f97316" />
            </div>
        );
    }

    const fullName = [
        user?.first_name,
        user?.middle_name,
        user?.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    const submitAll = () => {
        const values = form.getValues();
        updateProfile.mutate(values);
    };

    return (
        <>
            <div className="min-h-[100dvh] w-full flex justify-center px-4 py-6">
                <div className="w-full max-w-3xl rounded-2xl bg-gray-50/80 backdrop-blur-md px-6 py-8 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="flex flex-col items-center gap-3">
                        <Avatar
                            src={avatarUrl ?? undefined}
                            className="w-28 h-28 text-3xl cursor-pointer transition-transform duration-200 hover:scale-105"
                            isBordered
                            name={getNameIntials(fullName) as string}
                            onClick={avatarModal.onOpen}
                        />
                        <button
                            onClick={avatarModal.onOpen}
                            className="text-sm text-kidemia-secondary transition-colors duration-200 hover:text-kidemia-primary"
                        >
                            Tap to{" "}
                            <span className="text-kidemia-primary font-medium">upload</span>{" "}
                            picture
                        </button>
                    </div>

                    <ProfileAvatarModal
                        isOpen={avatarModal.isOpen}
                        onClose={avatarModal.onClose}
                        onSave={handleAvatarUpload}
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
                            <ProfileRow
                                key={field}
                                label={label}
                                value={(user as any)?.[field] || "-"}
                            >
                                <Input
                                    type={type ?? "text"}
                                    variant="underlined"
                                    classNames={{
                                        input: "transition-all duration-200",
                                    }}
                                    {...form.register(field)}
                                />
                            </ProfileRow>
                        ))}

                        <ProfileRow
                            label="Email"
                            value={user?.email}
                            disabled
                        />

                        <ProfileRow
                            label="Category"
                            value={user?.student?.category?.display_name}
                            status="pending"
                            isUpdating={updateCategoryMutation.isPending}
                            onUpdate={handleCategoryUpdate}
                        >
                            <Select
                                variant="underlined"
                                placeholder="Select a category"
                                selectedKeys={selectedCategory ? [selectedCategory] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as string;
                                    setSelectedCategory(selected);
                                }}
                                isLoading={categoriesLoading}
                                classNames={{
                                    trigger: "transition-all duration-200",
                                }}
                            >
                                {(categoriesData || []).map((category) => (
                                    <SelectItem
                                        key={category.category_name}
                                    >
                                        {category.display_name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </ProfileRow>

                        <ProfileRow
                            label="Guardian Email"
                            value={user?.student?.guardian_email ?? "-"}
                        />

                        <ProfileRow label="School" value="-" />

                        <div className="pt-8 flex flex-col gap-4">
                            <Button
                                className="bg-kidemia-primary text-white rounded-lg font-medium transition-all duration-200 hover:bg-kidemia-primary/90 hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                isLoading={updateProfile.isPending}
                                onPress={submitAll}
                                size="lg"
                                spinner={
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                }
                            >
                                {updateProfile.isPending ? "Saving..." : "Save Changes"}
                            </Button>

                            <Button
                                variant="light"
                                onPress={passwordModal.onOpen}
                                className="text-kidemia-secondary font-medium transition-all duration-200 hover:bg-gray-100"
                                size="lg"
                            >
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={passwordModal.isOpen}
                onClose={passwordModal.onClose}
            />
        </>
    );
}