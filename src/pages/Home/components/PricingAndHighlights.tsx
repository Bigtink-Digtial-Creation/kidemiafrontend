import { useQuery } from "@tanstack/react-query";
import PricingCard from "./PricingCard";
import { PricingBG } from "../../../assets/images";
import { QueryKeys } from "../../../utils/queryKeys";
import { ApiSDK } from "../../../sdk";


export default function PricingAndHighlights() {
  const {
    data: pricingData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QueryKeys.analytics],
    queryFn: async () => {
      return ApiSDK.SubscriptionPlansService.getPricingPlansApiV1SubscriptionPlansPricingGet();
    },
  });

  return (
    <section className="relative bg-[#0a1f35] text-white py-16 overflow-hidden">
      <img
        src={PricingBG}
        alt="Pricing Background"
        className="pointer-events-none select-none absolute"
        style={{
          width: "1458.155px",
          height: "1822.694px",
          top: "-847px",
          left: "-385px",
          opacity: 0.1,
          transform: "rotate(48.09deg)",
        }}
      />
      <div className="absolute inset-0 bg-[#08192d]/90" />
      <div className="relative max-w-6xl mx-auto px-6">
        <h3 className="text-center text-3xl md:text-4xl font-bold mb-3">
          Pricing
        </h3>

        <p className="text-center text-sm md:text-base opacity-80 mb-12">
          Flexible pricing plans for everyone
        </p>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 opacity-70">Loading pricing plans...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load pricing plans. Please Reload this page.</p>
          </div>
        )}

        {pricingData && (
          <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            <div className="flex gap-6 lg:gap-8 min-w-max">
              {pricingData.map((plan) => (
                <div key={plan.plan_code} className="w-[340px] flex-shrink-0">
                  <PricingCard
                    planCode={plan.plan_code}
                    title={plan.plan_name}
                    features={plan.benefits_list || []}
                    priceMonthly={plan.price_monthly}
                    priceYearly={plan.price_yearly}
                    currency={plan.currency}
                    yearlyDiscountPercentage={plan.yearly_discount_percentage}
                    isPopular={plan.is_popular}
                    isFeatured={plan.is_featured}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}