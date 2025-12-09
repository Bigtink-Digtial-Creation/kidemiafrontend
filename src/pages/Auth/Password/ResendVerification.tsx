import { useNavigate } from "react-router";
import { addToast, Button } from "@heroui/react";
import { AuthRoutes } from "../../../routes";
import { useMutation } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";
import { MdOutlineEmail } from "react-icons/md";

export default function ResendVerificationPage() {
    const navigate = useNavigate();

    const resendVerificationMutation = useMutation({
        mutationFn: () =>
            ApiSDK.AuthenticationService.resendVerificationApiV1AuthResendVerificationPost(),
        onSuccess(data) {
            addToast({
                title: "Email sent",
                description: data?.message,
                color: "success",
            });
        },
        onError(error) {
            const parsedError = apiErrorParser(error);
            addToast({
                title: "Couldn’t send email",
                description: parsedError.message,
                color: "danger",
            });
        },
    });

    return (
        <div className="w-full max-w-md mx-auto py-6 px-6 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
                <div className="rounded-full bg-kidemia-secondary/5 p-4">
                    <MdOutlineEmail className="text-kidemia-secondary text-3xl" />
                </div>
            </div>

            {/* Title */}
            <div className="space-y-1 text-center">
                <h2 className="text-xl font-semibold text-kidemia-black">
                    Verify your email
                </h2>
                <p className="text-sm text-kidemia-black2">
                    We’ll send a new verification link to your email address.
                </p>
            </div>

            {/* Action */}
            <Button
                onClick={() => resendVerificationMutation.mutate()}
                size="lg"
                className="bg-kidemia-secondary text-white w-full font-medium"
                radius="sm"
                isLoading={resendVerificationMutation.isPending}
                isDisabled={resendVerificationMutation.isPending}
            >
                Resend email
            </Button>

            {/* Secondary action */}
            <div className="text-center">
                <button
                    onClick={() => navigate(AuthRoutes.login)}
                    className="text-sm text-kidemia-secondary hover:underline font-medium"
                >
                    Back to login
                </button>
            </div>

            {/* Hint */}
            <p className="text-xs text-kidemia-black2 text-center">
                Don’t see it? Check your spam or promotions folder.
            </p>
        </div>
    );
}
