import { addToast, Button, Card, CardBody, Input } from "@heroui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Coins, CreditCard, Wallet, AlertCircle, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import type { PaymentMethod } from "../../sdk/generated";
import { PaymentRoutes } from "../../routes";
import { useUserWallet } from "../../hooks/useUserWallet";

const PRICE_PER_UNIT = 10;

const UNIT_PACKAGES = [
    { units: 100, bonus: 5, popular: false },
    { units: 250, bonus: 25, popular: true },
    { units: 500, bonus: 75, popular: false },
    { units: 1000, bonus: 200, popular: false },
];

export default function BuyUnitsPage() {
    const { data: wallet } = useUserWallet();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const [selectedPackage, setSelectedPackage] = useState<number | null>(1);
    const [customUnits, setCustomUnits] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"paystack" | "flutterwave">("paystack");
    const [_, setPaymentSuccess] = useState(false);

    const initiateMutation = useMutation({
        mutationFn: async (data: {
            amount: number;
            payment_method: PaymentMethod;
        }) => {
            return ApiSDK.TransactionsService.initiatePaymentApiV1TransactionsInitiatePost({
                amount: data.amount,
                payment_method: data.payment_method,
                callback_url: `${window.location.origin}/wallet/callback`,
            });
        },
        onSuccess: (response) => {
            if (response.payment_url) {
                window.location.href = response.payment_url;
            } else {
                addToast({
                    title: "Failed to initialize payment",
                    color: "warning",
                });
            }
        },
        onError: (error: any) => {
            addToast({
                title: error?.message || "Failed to initiate payment",
                color: "warning",
            });
        },
    });

    const verifyMutation = useMutation({
        mutationFn: async (reference: string) => {
            return ApiSDK.TransactionsService.verifyPaymentApiV1TransactionsVerifyTransactionReferenceGet(
                reference
            );
        },
        onSuccess: (response) => {
            if (response.status === "completed") {
                setPaymentSuccess(true);
                queryClient.setQueryData([QueryKeys.wallet], (oldData: any) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            balance: oldData.balance + totalUnits,
                        };
                    }
                    return oldData;
                });
                queryClient.invalidateQueries({ queryKey: [QueryKeys.wallet] });
                addToast({
                    title: "Tokens added to your wallet",
                    color: "success",
                });

                setTimeout(() => {
                    navigate(PaymentRoutes.buytoken);
                }, 3000);
            } else {
                addToast({
                    title: response.message || "Payment verification failed",
                    color: "warning",
                });
                navigate(PaymentRoutes.buytoken);
            }
        },
        onError: (error: any) => {
            addToast({
                title: error?.message || "Failed to verify payment",
                color: "warning",
            });
            navigate(PaymentRoutes.buytoken);
        },
    });

    useEffect(() => {
        const reference = searchParams.get("reference");
        if (reference) {
            verifyMutation.mutate(reference);
        }
    }, [searchParams]);

    // FIXED: Calculate units and prices correctly
    const selectedPkg = selectedPackage !== null ? UNIT_PACKAGES[selectedPackage] : null;
    const customUnitsValue = customUnits ? parseInt(customUnits) : 0;

    // Calculate tokens user will receive
    const totalUnits = selectedPkg
        ? selectedPkg.units + selectedPkg.bonus
        : customUnitsValue;

    // Calculate Naira amount to pay
    const amountToPay = selectedPkg
        ? selectedPkg.units * PRICE_PER_UNIT
        : customUnitsValue * PRICE_PER_UNIT;

    const handlePurchase = async () => {
        if (!selectedPkg && !customUnitsValue) {
            addToast({
                title: "Please select a package or enter custom units",
                color: "warning",
            });
            return;
        }

        // Send amount in Naira to payment gateway
        initiateMutation.mutate({
            amount: amountToPay,
            payment_method: paymentMethod,
        });
    };

    if (verifyMutation.isPending) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-kidemia-dark">Verifying Payment...</h2>
                    <p className="text-kidemia-grey">
                        Please wait while we confirm your transaction
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Buy Tokens</h1>
                <p className="text-kidemia-grey text-sm md:text-lg">
                    Purchase tokens to access premium assessments and features
                </p>
            </div>

            <Card className="bg-gradient-to-br from-kidemia-primary via-kidemia-primary to-kidemia-secondary border-none">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-white/80 text-sm">Current Balance</p>
                            <p className="text-3xl font-bold text-white">
                                {wallet?.balance?.toLocaleString() || '0'} <small className="text-md">Tokens</small>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-md font-semibold text-kidemia-dark mb-4">
                            Select Package
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {UNIT_PACKAGES.map((pkg, index) => {
                                const price = pkg.units * PRICE_PER_UNIT;
                                const totalTokens = pkg.units + pkg.bonus;
                                const pricePerToken = price / totalTokens;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedPackage(index);
                                            setCustomUnits("");
                                        }}
                                        disabled={initiateMutation.isPending}
                                        className={`relative p-6 rounded-2xl text-left transition-all border-2 disabled:opacity-50 ${selectedPackage === index
                                            ? "border-kidemia-primary shadow-md scale-105"
                                            : "border-kidemia-white bg-white hover:border-kidemia-secondary hover:shadow-sm"
                                            }`}
                                    >
                                        {pkg.popular && (
                                            <div className="absolute -top-3 -right-3">
                                                <div className="px-3 py-1 bg-kidemia-secondary text-white text-xs font-bold rounded-full shadow-lg">
                                                    BEST VALUE
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPackage === index
                                                        ? "bg-kidemia-primary"
                                                        : "bg-kidemia-white"
                                                        }`}
                                                >
                                                    <Coins
                                                        className={`w-6 h-6 ${selectedPackage === index
                                                            ? "text-white"
                                                            : "text-gray-600"
                                                            }`}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900">{pkg.units}</p>
                                                    <p className="text-sm text-gray-500">Base Tokens</p>
                                                </div>
                                            </div>

                                            {pkg.bonus > 0 && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg w-fit">
                                                    <Sparkles className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-semibold text-green-700">
                                                        +{pkg.bonus} Bonus Tokens
                                                    </span>
                                                </div>
                                            )}

                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-xl font-bold text-gray-900">
                                                    ₦{price.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    ₦{pricePerToken.toFixed(2)} per token · Get {totalTokens} total
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm md:text-lg font-normal text-gray-900 mb-3">
                            Or Enter Custom Amount
                        </h3>
                        <Card className="border border-gray-200 shadow-sm">
                            <CardBody className="p-5">
                                <Input
                                    type="number"
                                    placeholder="Enter number of tokens"
                                    value={customUnits}
                                    onChange={(e) => {
                                        setCustomUnits(e.target.value);
                                        setSelectedPackage(null);
                                    }}
                                    isDisabled={initiateMutation.isPending}
                                    startContent={<Coins className="w-4 h-4 text-kidemia-grey" />}
                                    endContent={<span className="text-sm text-kidemia-grey">Tokens</span>}
                                    min="1"
                                    classNames={{
                                        input: "text-lg",
                                    }}
                                />
                                {customUnitsValue > 0 && (
                                    <p className="text-sm text-kidemia-grey mt-2">
                                        Cost: ₦{(customUnitsValue * PRICE_PER_UNIT).toLocaleString()}
                                        <span className="text-xs ml-1">(₦{PRICE_PER_UNIT} per token)</span>
                                    </p>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardBody className="p-5 space-y-4">
                            <h3 className="text-lg font-semibold text-kidemia-dark">
                                Payment Summary
                            </h3>

                            <div className="space-y-3 py-4 border-y border-gray-200">
                                {selectedPkg ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-kidemia-grey">Base Tokens</span>
                                            <span className="font-semibold text-kidemia-dark">
                                                {selectedPkg.units} tokens
                                            </span>
                                        </div>
                                        {selectedPkg.bonus > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-green-600">Bonus Tokens</span>
                                                <span className="font-semibold text-green-600">
                                                    +{selectedPkg.bonus} tokens
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t">
                                            <span className="text-sm font-semibold text-kidemia-dark">
                                                Total Tokens
                                            </span>
                                            <span className="text-lg font-bold text-kidemia-primary">
                                                {totalUnits} tokens
                                            </span>
                                        </div>
                                    </>
                                ) : customUnitsValue > 0 ? (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-semibold text-kidemia-dark">
                                            Total Tokens
                                        </span>
                                        <span className="text-lg font-bold text-kidemia-primary">
                                            {customUnitsValue} tokens
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-kidemia-grey text-center py-4">
                                        Select a package or enter custom amount
                                    </p>
                                )}

                                <div className="flex justify-between pt-3 border-t-2 border-gray-300">
                                    <span className="text-base font-bold text-kidemia-dark">
                                        Amount to Pay
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                        ₦{amountToPay.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-kidemia-dark">Payment Gateway</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={paymentMethod === "paystack" ? "solid" : "bordered"}
                                        color={paymentMethod === "paystack" ? "danger" : "default"}
                                        onPress={() => setPaymentMethod("paystack")}
                                        isDisabled={initiateMutation.isPending}
                                        startContent={<CreditCard className="w-4 h-4" />}
                                        size="sm"
                                    >
                                        Paystack
                                    </Button>
                                    <Button
                                        variant={paymentMethod === "flutterwave" ? "solid" : "bordered"}
                                        color={paymentMethod === "flutterwave" ? "danger" : "default"}
                                        onPress={() => setPaymentMethod("flutterwave")}
                                        isDisabled={initiateMutation.isPending}
                                        startContent={<Wallet className="w-4 h-4" />}
                                        size="sm"
                                    >
                                        Flutterwave
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    className="w-full bg-kidemia-primary text-white font-semibold"
                                    size="lg"
                                    isDisabled={(!selectedPkg && !customUnitsValue) || initiateMutation.isPending}
                                    isLoading={initiateMutation.isPending}
                                    onPress={handlePurchase}
                                >
                                    {initiateMutation.isPending ? "Initializing..." : `Pay ₦${amountToPay.toLocaleString()}`}
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-blue-50 border border-blue-200">
                        <CardBody className="p-4 space-y-2">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-blue-900">
                                        Secure Payment
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        All transactions are encrypted and secure. Tokens are instantly
                                        credited to your wallet after successful payment.
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-kidemia-dark mb-4">
                    Why Buy Tokens?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-kidemia-dark">Instant Access</h4>
                        <p className="text-sm text-kidemia-grey">
                            Tokens are instantly available after successful payment
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-medium text-kidemia-dark">Flexible Payment</h4>
                        <p className="text-sm text-kidemia-grey">
                            Choose from multiple payment gateways for convenience
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-kidemia-dark">Bonus Packages</h4>
                        <p className="text-sm text-kidemia-grey">
                            Get extra tokens with our special bonus packages
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}