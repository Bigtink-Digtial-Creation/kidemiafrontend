import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addToast, Image } from "@heroui/react";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { AppLogo } from "../../assets/images";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../store/user.atom";
import type { BillingCycle } from "../../sdk/generated";
import PricingCard from "./components/PricingCard";
import AuthenticatedView from "./components/AuthenticatedView";
import LoginForm from "./components/LoginForm";
import SignupFlow from "./components/SignupFlow";



type Billing = "monthly" | "annual";

export default function CheckOutPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search);
  const [billing, setBilling] = useState<Billing>((search.get("billing") as Billing) || "annual");

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);

  const loggedInUser = useAtomValue(loggedinUserAtom);
  const isAuthenticated = !!loggedInUser && !!ApiSDK.OpenAPI.TOKEN;

  const {
    data: planData,
    isLoading: isPlanLoading,
    error: planError,
  } = useQuery({
    queryKey: [QueryKeys.pricing, id],
    queryFn: async () => {
      if (!id) throw new Error("Plan code is required");
      return ApiSDK.SubscriptionPlansService.getPlanDetailsApiV1SubscriptionPlansPlanCodeGet(id);
    },
    enabled: !!id,
  });

  const applyPromoMutation = useMutation({
    mutationFn: async (data: { promo_code: string; plan_code: string; billing_cycle: BillingCycle }) => {
      return ApiSDK.SubscriptionPlansService.validatePromotionApiV1SubscriptionPlansPromotionsValidatePost(data);
    },
    onSuccess: (response) => {
      if (response.data.is_valid) {
        setAppliedPromo(response.data);
        setPromoError("");
        addToast({
          title: "Promo code applied!",
          description: `You saved ${planData?.currency}${response.data.discount_amount}`,
          color: "success",
        });
      } else {
        setPromoError(response.message || "Invalid promotion code");
        setAppliedPromo(null);
        addToast({
          title: "Invalid promo code",
          description: response.message || "Please check your code and try again",
          color: "danger",
        });
      }
    },
    onError: () => {
      setPromoError("Failed to apply promo code");
      setAppliedPromo(null);
      addToast({
        title: "Error",
        description: "Failed to apply promo code. Please try again.",
        color: "danger",
      });
    },
  });

  const handleApplyPromo = () => {
    if (!promoCode.trim() || !id) return;
    const billingCycle = billing === "annual" ? "yearly" : "monthly";
    applyPromoMutation.mutate({
      promo_code: promoCode.trim(),
      plan_code: id,
      billing_cycle: billingCycle,
    });
  };

  const calculatePrice = () => {
    if (!planData) return "0";
    const basePrice = billing === "annual" ? parseFloat(planData.price_yearly) : parseFloat(planData.price_monthly);
    if (appliedPromo?.discount_amount) {
      return (basePrice - appliedPromo.discount_amount).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  const handleBillingToggle = (newBilling: Billing) => {
    setBilling(newBilling);
    const newSearch = new URLSearchParams(location.search);
    newSearch.set("billing", newBilling);
    navigate(`${location.pathname}?${newSearch.toString()}`, { replace: true });
  };

  const handleContinueToPayment = () => {
    addToast({
      title: "Redirecting to Payment",
      description: `${planData?.plan_name} (${billing}) — ${planData?.currency}${calculatePrice()}`,
      color: "primary",
    });
  };

  const handleLoginSuccess = () => {
    addToast({
      title: "Login Successful",
      description: "You can now continue with your subscription",
      color: "success",
    });
  };

  const handleSignupSuccess = () => {
    addToast({
      title: "Account created successfully!",
      description: "Please login to continue with your subscription",
      color: "success",
    });
    setShowLogin(true);
  };

  if (isPlanLoading) {
    return (
      <div className="min-h-screen bg-[#020202FF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (planError || !planData) {
    return (
      <div className="min-h-screen bg-[#020202FF] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-[#2AA2A0] px-6 py-3 rounded-xl"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#020202FF] via-[#0a1f35] to-[#020202FF] text-white flex flex-col items-center px-4 py-10">
      {/* Logo */}
      <div className="h-20 mb-10 flex items-center justify-center">
        <Image src={AppLogo} alt="logo" width={80} />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Pricing Card */}
        <PricingCard
          planData={planData}
          billing={billing}
          onBillingToggle={handleBillingToggle}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          promoError={promoError}
          appliedPromo={appliedPromo}
          onApplyPromo={handleApplyPromo}
          isApplyingPromo={applyPromoMutation.isPending}
          calculatePrice={calculatePrice}
        />

        {/* Right: Auth Section */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-[#07182C] border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                {isAuthenticated ? "Upgrade to" : "Subscribe to"} {planData.plan_name}
              </h3>
              <p className="text-sm opacity-70">
                {billing === "annual" ? "Annual" : "Monthly"} billing • Cancel anytime
              </p>
            </div>

            {isAuthenticated ? (
              <AuthenticatedView
                user={loggedInUser}
                onContinueToPayment={handleContinueToPayment}
              />
            ) : showLogin ? (
              <LoginForm
                onSuccess={handleLoginSuccess}
                onBackToSignup={() => setShowLogin(false)}
              />
            ) : (
              <SignupFlow
                onSuccess={handleSignupSuccess}
                onSwitchToLogin={() => setShowLogin(true)}
                planId={id!}
                billing={billing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}