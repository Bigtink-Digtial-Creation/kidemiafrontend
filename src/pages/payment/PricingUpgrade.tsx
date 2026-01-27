import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useActiveSubscription } from "../../hooks/useActiveSubscription";
import SpinnerCircle from "../../components/Spinner/Circle";
import { Button, addToast } from "@heroui/react";
import { useNavigate } from "react-router";
import { BillingToggle } from "./components/BillingToggle";
import { PricingCardTwo } from "./components/PricingCardTwo";
import {
    Calendar,
    CreditCard,
    Users,
    TrendingUp,
    AlertCircle,
    Pause,
    Play,
    XCircle,
    CheckCircle
} from "lucide-react";
import { PaymentRoutes } from "../../routes";
import { userRoleAtom } from "../../store/user.atom";
import { useAtomValue } from "jotai";

export default function SubscriptionDashboard() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [view, setView] = useState<"current" | "upgrade">("current");
    const isYearly = billingCycle === "yearly";
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const userRole = useAtomValue(userRoleAtom);
    const isIndividual = userRole === "student";
    const isGuardian = userRole === "guardian";

    // Use the custom hook for subscription data
    const {
        activeSubscription,
        currentPlanCode,
        isLoading: subscriptionsLoading,
        error: subscriptionsError,
    } = useActiveSubscription();

    const {
        data: pricingData,
        isLoading: pricingLoading,
        error: pricingError,
    } = useQuery({
        queryKey: [QueryKeys.pricing],
        queryFn: async () => {
            return ApiSDK.SubscriptionPlansService.getPricingPlansApiV1SubscriptionPlansPricingGet(
                isIndividual,
                isGuardian,
                false
            );
        },
        staleTime: 1000 * 60 * 5,
    });

    // Pause subscription mutation
    const pauseMutation = useMutation({
        mutationFn: async (subscriptionId: string) => {
            return ApiSDK.SubscriptionsService.pauseSubscriptionApiV1SubscriptionsSubscriptionIdPausePost(subscriptionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.mysubscription] });
            addToast({
                title: "Subscription Paused",
                description: "Your subscription has been paused. You can resume it anytime.",
                color: "success",
            });
        },
        onError: () => {
            addToast({
                title: "Error",
                description: "Failed to pause subscription. Please try again.",
                color: "danger",
            });
        },
    });

    // Resume subscription mutation
    const resumeMutation = useMutation({
        mutationFn: async (subscriptionId: string) => {
            return ApiSDK.SubscriptionsService.resumeSubscriptionApiV1SubscriptionsSubscriptionIdResumePost(subscriptionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.mysubscription] });
            addToast({
                title: "Subscription Resumed",
                description: "Your subscription has been resumed successfully.",
                color: "success",
            });
        },
        onError: () => {
            addToast({
                title: "Error",
                description: "Failed to resume subscription. Please try again.",
                color: "danger",
            });
        },
    });

    // Cancel subscription mutation
    const cancelMutation = useMutation({
        mutationFn: async ({ subscriptionId, data }: { subscriptionId: string; data: any }) => {
            return ApiSDK.SubscriptionsService.cancelSubscriptionApiV1SubscriptionsSubscriptionIdCancelPost(
                subscriptionId,
                data
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.mysubscription] });
            setShowCancelModal(false);
            setCancelReason("");
            addToast({
                title: "Subscription Cancelled",
                description: "Your subscription will remain active until the end of the billing period.",
                color: "success",
            });
        },
        onError: () => {
            addToast({
                title: "Error",
                description: "Failed to cancel subscription. Please try again.",
                color: "danger",
            });
        },
    });

    const handleUpgrade = (planCode: string) => {
        const id = planCode.toLowerCase().replace(/\s+/g, "-");
        navigate(PaymentRoutes.checkout.replace(":id", id) +
            `?billing=${billingCycle}`);
    };

    const handlePause = (subscriptionId: string) => {
        pauseMutation.mutate(subscriptionId);
    };

    const handleResume = (subscriptionId: string) => {
        resumeMutation.mutate(subscriptionId);
    };

    const handleCancel = (subscriptionId: string) => {
        if (!cancelReason.trim()) {
            addToast({
                title: "Reason Required",
                description: "Please provide a reason for cancellation.",
                color: "warning",
            });
            return;
        }

        cancelMutation.mutate({
            subscriptionId,
            data: {
                reason: cancelReason,
                cancel_immediately: false,
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "text-green-600 bg-green-50 border-green-200";
            case "suspended":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "cancelled":
                return "text-red-600 bg-red-50 border-red-200";
            case "failed":
                return "text-orange-600 bg-orange-50 border-orange-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (pricingLoading || subscriptionsLoading) {
        return (
            <div className="h-screen flex justify-center items-center bg-gray-50">
                <SpinnerCircle />
            </div>
        );
    }

    if (pricingError || subscriptionsError) {
        return (
            <div className="h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 mb-4">
                        Failed to load subscription information
                    </p>
                    <Button color="danger" className="bg-kidemia-primary" onPress={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // If no subscription, show upgrade plans directly
    if (!activeSubscription) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-6 text-center">
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Choose Your Plan
                        </h1>
                        <p className="mt-2 text-gray-600">Get started with a subscription plan that fits your needs</p>
                    </header>

                    <div className="mb-10 flex justify-center">
                        <BillingToggle
                            isYearly={isYearly}
                            onToggle={(yearly) => setBillingCycle(yearly ? "yearly" : "monthly")}
                        />
                    </div>

                    <div className="w-full max-w-5xl mx-auto px-4">
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                            {pricingData?.map((plan: any) => {
                                const price = parseFloat(plan.price_monthly);
                                const yearlyPrice = parseFloat(plan.price_yearly);
                                const features = plan.benefits_list || [];

                                return (
                                    <PricingCardTwo
                                        key={plan.plan_code}
                                        name={plan.plan_name}
                                        description={plan.short_description}
                                        price={price}
                                        yearlyPrice={yearlyPrice}
                                        currency={plan.currency}
                                        isYearly={isYearly}
                                        features={features}
                                        isCurrentPlan={false}
                                        onSelect={() => handleUpgrade(plan.plan_code)}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <footer className="mt-12 text-center">
                        <p className="text-gray-600">
                            Need custom pricing?{" "}
                            <a href="#" className="font-medium text-kidemia-primary hover:underline">
                                Contact us →
                            </a>
                        </p>
                    </footer>
                </div>
            </main>
        );
    }

    // Has active subscription - show dashboard with toggle
    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header with View Toggle */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-900">
                            Subscription Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage your subscription and billing</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setView("current")}
                            className={`px-4 py-2 rounded-lg font-medium transition ${view === "current"
                                ? "bg-kidemia-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Current Plan
                        </button>
                        <button
                            onClick={() => setView("upgrade")}
                            className={`px-4 py-2 rounded-lg font-medium transition ${view === "upgrade"
                                ? "bg-kidemia-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {activeSubscription.status === "suspended" ? "Plans" : "Upgrade"}
                        </button>
                    </div>
                </div>

                {/* Status Alert */}
                {activeSubscription.status === "failed" && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Payment Failed</h3>
                            <p className="text-sm text-red-700">
                                Your last payment failed. Please update your payment method to continue your subscription.
                            </p>
                        </div>
                    </div>
                )}

                {/* Current Plan View */}
                {view === "current" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        {/* Main Card */}
                        <div className="lg:col-span-2 p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                                        {activeSubscription.plan_code.replace(/_/g, " ")}
                                    </h2>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                            activeSubscription.status
                                        )}`}
                                    >
                                        {activeSubscription.status}
                                    </span>
                                </div>

                                <div className="sm:text-right">
                                    <div className="text-3xl font-bold text-kidemia-primary">
                                        {activeSubscription.currency}
                                        {parseFloat(String(activeSubscription.price)).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        per {activeSubscription.billing_cycle.toLowerCase()}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-kidemia-primary" />
                                        <span className="text-sm text-gray-600">Next Billing</span>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {new Date(
                                            activeSubscription.next_billing_date || ""
                                        ).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-kidemia-primary" />
                                        <span className="text-sm text-gray-600">Days Remaining</span>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {activeSubscription.days_remaining} days
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-kidemia-primary" />
                                        <span className="text-sm text-gray-600">Members</span>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {activeSubscription.current_members}/
                                        {activeSubscription.max_members || "∞"}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="w-4 h-4 text-kidemia-primary" />
                                        <span className="text-sm text-gray-600">Auto Renew</span>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {activeSubscription.auto_renew ? "Enabled" : "Disabled"}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {activeSubscription.status === "active" && (
                                    <>
                                        <Button
                                            onPress={() => handlePause(activeSubscription.id)}
                                            isLoading={pauseMutation.isPending}
                                            className="w-full min-h-[48px] bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold"
                                            startContent={<Pause className="w-4 h-4" />}
                                        >
                                            Cancel Subscription
                                        </Button>

                                        <Button
                                            onPress={() => setView("upgrade")}
                                            className="w-full min-h-[48px] bg-kidemia-primary text-white font-semibold"
                                        >
                                            Upgrade Plan
                                        </Button>
                                    </>
                                )}

                                {activeSubscription.status === "suspended" && (
                                    <Button
                                        onPress={() => handleResume(activeSubscription.id)}
                                        isLoading={resumeMutation.isPending}
                                        className="hidden w-full min-h-[48px] bg-kidemia-primary text-white font-semibold"
                                        startContent={<Play className="w-4 h-4" />}
                                    >
                                        Resume Subscription
                                    </Button>
                                )}

                                {(activeSubscription.status === "active" ||
                                    activeSubscription.status === "suspended") && (
                                        <Button
                                            onPress={() => setShowCancelModal(true)}
                                            className="hidden w-full min-h-[48px] bg-red-50 hover:bg-red-100 text-red-600 font-semibold border border-red-200"
                                            startContent={<XCircle className="w-4 h-4" />}
                                        >
                                            Cancel Subscription Original
                                        </Button>
                                    )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4 lg:space-y-6">
                            {/* Features */}
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Plan Features
                                </h3>
                                <div className="space-y-3">
                                    {activeSubscription.features &&
                                        Object.entries(activeSubscription.features).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex items-start gap-2"
                                                >
                                                    <CheckCircle className="w-5 h-5 text-kidemia-primary flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm break-words">
                                                        <div className="font-medium text-gray-900 capitalize">
                                                            {key.replace(/_/g, " ")}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            {value?.toString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>

                            {/* Usage */}
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Usage This Period
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Tests Taken</span>
                                            <span className="font-semibold text-gray-900">
                                                {activeSubscription.total_tests_taken}
                                            </span>
                                        </div>

                                        {activeSubscription.limits?.tests_per_month && (
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-kidemia-primary h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${Math.min(
                                                            (activeSubscription.total_tests_taken /
                                                                activeSubscription.limits
                                                                    .tests_per_month) *
                                                            100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Exams Taken</span>
                                            <span className="font-semibold text-gray-900">
                                                {activeSubscription.total_exams_taken}
                                            </span>
                                        </div>

                                        {activeSubscription.limits?.exams_per_month && (
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-kidemia-primary h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${Math.min(
                                                            (activeSubscription.total_exams_taken /
                                                                activeSubscription.limits
                                                                    .exams_per_month) *
                                                            100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Upgrade View */}
                {view === "upgrade" && (
                    <>
                        <div className="mb-10 flex justify-center">
                            <BillingToggle
                                isYearly={isYearly}
                                onToggle={(yearly) => setBillingCycle(yearly ? "yearly" : "monthly")}
                            />
                        </div>

                        <div className="w-full max-w-5xl mx-auto px-4">
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                                {pricingData?.map((plan: any) => {
                                    const isCurrentPlan = plan.plan_code === currentPlanCode;
                                    const price = parseFloat(plan.price_monthly);
                                    const yearlyPrice = parseFloat(plan.price_yearly);
                                    const features = plan.benefits_list || [];

                                    return (
                                        <PricingCardTwo
                                            key={plan.plan_code}
                                            name={plan.plan_name}
                                            description={plan.short_description}
                                            price={price}
                                            yearlyPrice={yearlyPrice}
                                            currency={plan.currency}
                                            isYearly={isYearly}
                                            features={features}
                                            isCurrentPlan={isCurrentPlan}
                                            onSelect={() => handleUpgrade(plan.plan_code)}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <footer className="mt-12 text-center">
                            <p className="text-gray-600">
                                Need custom pricing?{" "}
                                <a href="#" className="font-medium text-kidemia-primary hover:underline">
                                    Contact us →
                                </a>
                            </p>
                        </footer>
                    </>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Cancel Subscription?</h3>
                        <p className="text-gray-600 mb-6">
                            We're sorry to see you go. Your subscription will remain active until the end of the current billing period.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Please tell us why you're cancelling (optional)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Your feedback helps us improve..."
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-kidemia-primary focus:ring-2 focus:ring-kidemia-primary/20 min-h-[100px]"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onPress={() => setShowCancelModal(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold"
                            >
                                Keep Subscription
                            </Button>
                            <Button
                                onPress={() => handleCancel(activeSubscription.id)}
                                isLoading={cancelMutation.isPending}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                            >
                                Confirm Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}