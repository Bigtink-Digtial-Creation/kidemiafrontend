import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { Image, Button } from "@heroui/react";
import { AppLogo } from "../../assets/images";
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react";
import { GuardianRoutes, PaymentRoutes, SidebarRoutes } from "../../routes";
import { useAtomValue } from "jotai";
import { userRoleAtom } from "../../store/user.atom";

type VerificationStatus = "verifying" | "success" | "failed";

export default function SubscriptionCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<VerificationStatus>("verifying");
    const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

    let targetPath = SidebarRoutes.dashboard;
    const userRole = useAtomValue(userRoleAtom);
    if (userRole === "guardian") {
        targetPath = GuardianRoutes.dashboard;
    } else if (userRole === "student") {
        targetPath = SidebarRoutes.dashboard;
    } else if (userRole === "institution_admin") {
        targetPath = "/admin/dashboard";
    }

    const reference = searchParams.get("reference");

    const verifyMutation = useMutation({
        mutationFn: async (ref: string) => {
            return ApiSDK.SubscriptionsService.verifySubscriptionPaymentApiV1SubscriptionsVerifyReferencePost(ref);
        },
        onSuccess: (response) => {
            if (response.data.status === "success") {
                setStatus("success");
                setSubscriptionDetails(response.data);

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate(PaymentRoutes.subscriptionUpgrade);
                }, 3000);
            } else {
                setStatus("failed");
            }
        },
        onError: () => {
            setStatus("failed");
        },
    });

    useEffect(() => {
        if (reference) {
            verifyMutation.mutate(reference);
        } else {
            setStatus("failed");
        }
    }, [reference]);

    const handleRetry = () => {
        if (reference) {
            setStatus("verifying");
            verifyMutation.mutate(reference);
        }
    };

    const handleGoToDashboard = () => {
        navigate(PaymentRoutes.subscriptionUpgrade);
    };

    const handleGoHome = () => {
        navigate(targetPath);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image src={AppLogo} alt="logo" width={80} />
                </div>

                {/* Card */}
                <div className="p-8 sm:p-12 ">
                    {/* Verifying State */}
                    {status === "verifying" && (
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-kidemia-primary/20 rounded-full animate-ping" />
                                    <Loader2 className="w-16 h-16 text-kidemia-primary animate-spin relative z-10" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Verifying Payment</h2>
                            <p className="text-gray-600 mb-6">
                                Please wait while we confirm your subscription payment...
                            </p>
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 bg-kidemia-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-kidemia-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-kidemia-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {status === "success" && (
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center relative z-10">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
                                Subscription Activated! 🎉
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your subscription has been successfully activated. Welcome aboard!
                            </p>

                            {subscriptionDetails && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-left">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Subscription ID:</span>
                                            <span className="font-mono text-gray-900 text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                                {subscriptionDetails.subscription_reference}
                                            </span>
                                        </div>
                                        {subscriptionDetails.next_payment_date && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 font-medium">Next Billing:</span>
                                                <span className="text-gray-900 font-semibold">
                                                    {new Date(subscriptionDetails.next_payment_date).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex items-center justify-center gap-2 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-xs font-medium">Payment Confirmed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button
                                    onPress={handleGoToDashboard}
                                    className="w-full bg-kidemia-primary text-white font-semibold py-6 text-base"
                                >
                                    Go to Dashboard
                                </Button>
                                <p className="text-xs text-gray-500">
                                    Redirecting automatically in 3 seconds...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Failed State */}
                    {status === "failed" && (
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 flex items-center justify-center">
                                    <XCircle className="w-12 h-12 text-red-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
                                Payment Verification Failed
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {reference
                                    ? "We couldn't verify your payment. This could be due to a payment failure or network issue."
                                    : "No payment reference found. Please try subscribing again."}
                            </p>

                            <div className="space-y-3">
                                {reference && (
                                    <Button
                                        onPress={handleRetry}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3"
                                    >
                                        Retry Verification
                                    </Button>
                                )}
                                <Button
                                    onPress={handleGoHome}
                                    className="w-full bg-kidemia-primary text-white font-semibold py-3"
                                    startContent={<Home className="w-4 h-4" />}
                                >
                                    Go Home
                                </Button>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <p className="text-sm text-yellow-800 flex items-start gap-2">
                                    <span className="text-lg">💡</span>
                                    <span>
                                        If you were charged but verification failed, don't worry! Your subscription will be activated automatically, or contact support.
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Support Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Need help?{" "}
                        <a href="/support" className="text-kidemia-primary font-medium hover:underline">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}