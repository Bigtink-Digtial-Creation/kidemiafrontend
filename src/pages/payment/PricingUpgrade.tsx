import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../store/user.atom";
import SpinnerCircle from "../../components/Spinner/Circle";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useNavigate } from "react-router";

interface SubscriptionResponse {
    id: string;
    subscription_reference: string;
    plan_code: string;
    subscription_type: string;
    status: string;
    owner_id: string;
    institution_id?: string | null;
    price: string | number;
    currency: string;
    billing_cycle: string;
    start_date: string;
    end_date: string;
    trial_end_date?: string | null;
    auto_renew: boolean;
    next_billing_date?: string | null;
    features?: Record<string, any> | null;
    limits?: Record<string, any> | null;
    max_members?: number | null;
    current_members: number;
    total_tests_taken: number;
    total_exams_taken: number;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
    applied_promo_code?: string | null;
    promo_discount_amount?: string | number | null;
    renewed_at?: string | null;
    upgraded_from?: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    days_remaining: number;
    can_add_members: boolean;
    available_slots: number;
}

const BillingToggle = ({ isYearly, onToggle }: { isYearly: boolean; onToggle: (isYearly: boolean) => void }) => {
    return (
        <div className="flex items-center justify-center gap-1 rounded-full bg-gray-100 p-1">
            <button
                onClick={() => onToggle(false)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${!isYearly
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
            >
                Monthly
            </button>
            <button
                onClick={() => onToggle(true)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${isYearly
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
            >
                Yearly
                <span className="rounded-full bg-kidemia-primary/10 px-2 py-0.5 text-xs font-semibold text-kidemia-primary">
                    Save 20%
                </span>
            </button>
        </div>
    );
};

const PricingCard = ({
    name,
    price,
    yearlyPrice,
    currency,
    isYearly,
    features,
    isCurrentPlan,
    onSelect,
}: {
    name: string;
    price: number;
    yearlyPrice?: number;
    currency: string;
    isYearly: boolean;
    features: any[];
    isCurrentPlan: boolean;
    onSelect: () => void;
}) => {
    const displayPrice = isYearly && yearlyPrice ? yearlyPrice : price;
    const monthlySavings = isYearly && yearlyPrice ? Math.round(((price * 12 - yearlyPrice * 12) / (price * 12)) * 100) : 0;

    return (
        <Card className="relative flex flex-col transition-shadow duration-200 hover:shadow-lg bg-white border border-gray-200">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {name}
                    </h3>

                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-900">
                            {currency}{displayPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-600 text-sm">
                            /{isYearly ? "yr" : "mo"}
                        </span>
                    </div>
                </div>

                {isYearly && monthlySavings > 0 && (
                    <p className="mt-1 text-sm font-medium text-kidemia-primary">
                        Save {monthlySavings}%
                    </p>
                )}
            </CardHeader>

            <CardBody className="flex flex-1 flex-col">
                <ul className="mb-6 flex-1 space-y-3">
                    {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-kidemia-primary" />
                            <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    onClick={onSelect}
                    disabled={isCurrentPlan}
                    className={`w-full ${isCurrentPlan
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-kidemia-primary text-white hover:bg-kidemia-primary/90"
                        }`}
                >
                    {isCurrentPlan ? "Current Plan" : "Get Started"}
                </Button>
            </CardBody>
        </Card>
    );
};

export default function PricingUpgradePage() {
    const loggedInUser = useAtomValue(loggedinUserAtom);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const isYearly = billingCycle === "yearly";
    const navigate = useNavigate()
    const {
        data: pricingData,
        isLoading: pricingLoading,
        error: pricingError,
    } = useQuery({
        queryKey: [QueryKeys.pricing],
        queryFn: async () => {
            return ApiSDK.SubscriptionPlansService.getPricingPlansApiV1SubscriptionPlansPricingGet(
                true,
                false,
                false
            );
        },
    });

    const {
        data: subscriptionsResponse,
        isLoading: subscriptionsLoading,
        error: subscriptionsError,
    } = useQuery({
        queryKey: [QueryKeys.pricing],
        queryFn: async () => {
            return ApiSDK.SubscriptionsService.getMySubscriptionsApiV1SubscriptionsGet();
        },
        enabled: !!loggedInUser,
    });

    const activeSubscription = useMemo(() => {
        const subscriptions = (subscriptionsResponse?.data ?? []) as SubscriptionResponse[];
        return subscriptions.find(
            (sub) => sub.is_active && sub.status === "active"
        );
    }, [subscriptionsResponse]);

    const currentPlanCode = activeSubscription?.plan_code;

    const handleUpgrade = (planCode: string) => {
        console.log("Upgrading to:", planCode);
        const id = planCode.toLowerCase().replace(/\s+/g, "-");
        navigate(`/payment/checkout/${id}/plan?billing=${billingCycle}`);
    };

    if (pricingLoading || subscriptionsLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <SpinnerCircle />
            </div>
        );
    }

    if (pricingError || subscriptionsError) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">
                        Failed to load pricing information
                    </p>
                    <Button color="danger" className="bg-kidemia-primary" onPress={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-md md:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Choose Your Plan
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Simple, transparent pricing that is suitable with you.
                    </p>
                </header>

                {/* Billing Toggle */}
                <div className="mb-10 flex justify-center">
                    <BillingToggle
                        isYearly={isYearly}
                        onToggle={(yearly) => setBillingCycle(yearly ? "yearly" : "monthly")}
                    />
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pricingData?.map((plan: any) => {
                        const isCurrentPlan = plan.plan_code === currentPlanCode;
                        const price = parseFloat(plan.price_monthly);
                        const yearlyPrice = parseFloat(plan.price_yearly);
                        const features = plan.benefits_list || [];

                        return (
                            <PricingCard
                                key={plan.plan_code}
                                name={plan.plan_name}
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

                {/* Enterprise CTA */}
                <footer className="mt-12 text-center">
                    <p className="text-gray-600">
                        Need custom pricing?{" "}
                        <a
                            href="#"
                            className="font-medium text-kidemia-primary hover:underline"
                        >
                            Contact us →
                        </a>
                    </p>
                </footer>
            </div>
        </main>
    );
}