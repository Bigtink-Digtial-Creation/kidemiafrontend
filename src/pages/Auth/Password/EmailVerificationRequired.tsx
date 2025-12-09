import { useNavigate } from "react-router";
import { addToast, Button } from "@heroui/react";
import { AuthRoutes, SidebarRoutes } from "../../../routes";
import { useMutation } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";
import { MdOutlineEmail, MdWarning } from "react-icons/md";
import { useAtom, useAtomValue } from "jotai";
import { loggedinUserAtom, storedAuthTokenAtom, userRoleAtom } from "../../../store/user.atom";

export default function EmailVerificationRequiredPage() {
    const navigate = useNavigate();
    const loggedInUser = useAtomValue(loggedinUserAtom);
    const [, setAuthToken] = useAtom(storedAuthTokenAtom);
    const [, setLoggedInUser] = useAtom(loggedinUserAtom);
    const [, setUserRole] = useAtom(userRoleAtom);

    const resendVerificationMutation = useMutation({
        mutationFn: () =>
            ApiSDK.AuthenticationService.resendVerificationApiV1AuthResendVerificationPost(),
        onSuccess(data) {
            addToast({
                title: "Email Sent!",
                description:
                    data?.message || "Check your inbox for the verification link",
                color: "success",
            });
        },
        onError(error) {
            const parsedError = apiErrorParser(error);
            addToast({
                title: "Failed to Send Email",
                description: parsedError.message,
                color: "danger",
            });
        },
    });

    const handleResend = () => {
        resendVerificationMutation.mutate();
    };

    const handleLogout = () => {
        setAuthToken(null);
        setLoggedInUser(null);
        setUserRole(null);
        navigate(AuthRoutes.login);
    };

    const handleCheckVerification = () => {
        // Refresh the page or fetch user data to check if verified
        window.location.href = SidebarRoutes.dashboard;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="py-8 w-full max-w-md space-y-6 px-8 bg-white rounded-lg shadow-lg">
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-orange-100 p-6">
                            <MdWarning className="text-orange-600 text-6xl" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
                            Verify Your Email
                        </h2>
                        <p className="text-lg text-kidemia-black2 text-center font-medium">
                            We sent a verification email to
                        </p>
                        <p className="text-lg text-kidemia-secondary text-center font-semibold">
                            {loggedInUser?.user?.email}
                        </p>
                        <p className="text-base text-kidemia-black2 text-center">
                            You need to verify your email before you can access your account.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-start gap-2">
                            <MdOutlineEmail className="text-blue-600 text-xl mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-blue-900 text-sm font-medium">
                                    Check your inbox and click the verification link
                                </p>
                                <p className="text-blue-800 text-sm">
                                    Don't forget to check your spam folder
                                </p>
                            </div>
                        </div>
                    </div>

                    {resendVerificationMutation.isSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 text-center font-medium">
                                ✓ Verification email sent! Check your inbox.
                            </p>
                        </div>
                    )}

                    <div className="w-full space-y-2">
                        <Button
                            onPress={handleCheckVerification}
                            variant="solid"
                            size="lg"
                            className="bg-green-600 text-white font-semibold w-full"
                            radius="sm"
                        >
                            I've Verified My Email
                        </Button>

                        <Button
                            onClick={handleResend}
                            variant="solid"
                            size="lg"
                            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                            radius="sm"
                            isDisabled={resendVerificationMutation.isPending}
                            isLoading={resendVerificationMutation.isPending}
                        >
                            Resend Verification Email
                        </Button>

                        <Button
                            onClick={handleLogout}
                            variant="bordered"
                            size="lg"
                            className="border-kidemia-secondary text-kidemia-secondary font-semibold w-full"
                            radius="sm"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}