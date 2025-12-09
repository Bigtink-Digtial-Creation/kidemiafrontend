import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Progress,
    addToast,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordRequest } from "../../../sdk/generated";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";


type Props = {
    isOpen: boolean;
    onClose: () => void;
};

type FormData = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

function getPasswordStrength(password: string) {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const map = [
        { label: "Weak", value: 25, color: "danger" },
        { label: "Fair", value: 50, color: "warning" },
        { label: "Good", value: 75, color: "primary" },
        { label: "Strong", value: 100, color: "success" },
    ];

    return map[Math.max(0, score - 1)];
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
    const { register, handleSubmit, reset, watch, formState: { } } = useForm<FormData>();
    const password = watch("new_password") || "";
    const confirmPassword = watch("confirm_password") || "";

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const strength = useMemo(
        () => getPasswordStrength(password),
        [password],
    );

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) =>
            ApiSDK.AuthenticationService.changePasswordApiV1AuthChangePasswordPost(data),
        onSuccess: () => {
            addToast({
                color: "success",
                description: "Password changed successfully",
            });
            reset();
            onClose();
        },
        onError: (error) => {
            addToast({
                color: "danger",
                description: apiErrorParser(error).message,
            });
        },
    });




    const submit = handleSubmit((data) => {
        // Validation
        if (!data.current_password) {
            addToast({
                color: "warning",
                description: "Please enter your current password",
            });
            return;
        }

        if (!data.new_password) {
            addToast({
                color: "warning",
                description: "Please enter a new password",
            });
            return;
        }

        if (data.new_password.length < 8) {
            addToast({
                color: "warning",
                description: "Password must be at least 8 characters",
            });
            return;
        }

        if (data.new_password !== data.confirm_password) {
            addToast({
                color: "warning",
                description: "Passwords do not match",
            });
            return;
        }

        if (data.current_password === data.new_password) {
            addToast({
                color: "warning",
                description: "New password must be different from current password",
            });
            return;
        }

        changePasswordMutation.mutate({
            current_password: data.current_password,
            new_password: data.new_password,
        });
    });

    const handleClose = () => {
        reset();
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            placement="center"
            classNames={{
                base: "transition-all duration-300",
            }}
        >
            <ModalContent>
                <ModalHeader className="text-xl font-semibold">
                    Change Password
                </ModalHeader>

                <ModalBody className="space-y-5 py-6">
                    <Input
                        label="Current Password"
                        type={showCurrent ? "text" : "password"}
                        placeholder="Enter current password"
                        {...register("current_password")}
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="focus:outline-none transition-colors duration-200 hover:text-kidemia-primary"
                            >
                                {showCurrent ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        }
                        classNames={{
                            input: "transition-all duration-200",
                        }}
                    />

                    <div className="space-y-2">
                        <Input
                            label="New Password"
                            type={showNew ? "text" : "password"}
                            placeholder="Enter new password"
                            {...register("new_password")}
                            endContent={
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="focus:outline-none transition-colors duration-200 hover:text-kidemia-primary"
                                >
                                    {showNew ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            }
                            classNames={{
                                input: "transition-all duration-200",
                            }}
                        />

                        {password && (
                            <div className="space-y-2 animate-in fade-in duration-200">
                                <Progress
                                    value={strength.value}
                                    color={strength.color as any}
                                    size="sm"
                                    classNames={{
                                        indicator: "transition-all duration-500",
                                    }}
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        Strength: <span className="font-semibold">{strength.label}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Min. 8 characters
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Confirm New Password"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...register("confirm_password")}
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="focus:outline-none transition-colors duration-200 hover:text-kidemia-primary"
                            >
                                {showConfirm ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        }
                        classNames={{
                            input: "transition-all duration-200",
                        }}
                        isInvalid={
                            confirmPassword.length > 0 &&
                            password !== confirmPassword
                        }
                        errorMessage={
                            confirmPassword.length > 0 &&
                                password !== confirmPassword
                                ? "Passwords do not match"
                                : ""
                        }
                    />
                </ModalBody>

                <ModalFooter className="gap-2">
                    <Button
                        variant="light"
                        onPress={handleClose}
                        className="transition-all duration-200 hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-kidemia-primary text-white font-medium transition-all duration-200 hover:bg-kidemia-primary/90 hover:shadow-md active:scale-95"
                        onPress={() => submit()}
                        isLoading={changePasswordMutation.isPending}
                    >
                        {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}