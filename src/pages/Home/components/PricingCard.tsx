import { useState } from "react";
import { useNavigate } from "react-router";

interface PricingCardProps {
  planCode: string;
  title: string;
  features: string[];
  priceMonthly: string;
  priceYearly: string;
  currency: string;
  yearlyDiscountPercentage: number;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export default function PricingCard({
  planCode,
  title,
  features,
  priceMonthly,
  priceYearly,
  currency,
  yearlyDiscountPercentage,
  isPopular = false,
  isFeatured = false,
}: PricingCardProps) {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const handlePlanPurchase = () => {
    const planName = planCode.toLowerCase().replace(/\s+/g, "-");
    navigate(`/payment/checkout/${planName}/plan?billing=${billingCycle}`);
  };

  const price = billingCycle === "annual" ? `${currency}${priceYearly}` : `${currency}${priceMonthly}`;
  const period = billingCycle === "annual" ? "per annum" : "per month";

  return (
    <div className={`rounded-3xl bg-[#07182C] border p-6 md:p-8 shadow-lg ${isPopular || isFeatured ? "border-[#FF8C22]/50" : "border-white/10"
      }`}>
      {(isPopular || isFeatured) && (
        <div className="mb-4">
          <span className="inline-block bg-[#FF8C22] text-white text-xs px-3 py-1 rounded-full font-semibold">
            {isPopular ? "Most Popular" : "Featured"}
          </span>
        </div>
      )}

      <h4 className="text-2xl font-semibold">
        <span className="text-[#FF8C22]">{title}</span>{" "}
      </h4>

      <div className="flex items-center mt-6 bg-white/5 p-1 rounded-full w-max">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-4 py-1 rounded-full text-sm transition-all duration-300 ${billingCycle === "monthly"
            ? "bg-white/20 backdrop-blur-md font-semibold scale-105 text-white"
            : "opacity-70 text-gray-300"
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("annual")}
          className={`px-4 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${billingCycle === "annual"
            ? "bg-white/20 backdrop-blur-md font-semibold scale-105 text-white"
            : "opacity-70 text-gray-300"
            }`}
        >
          Annual
          {billingCycle === "annual" && yearlyDiscountPercentage > 0 && (
            <span className="text-[10px] bg-[#1cc557] text-black px-2 py-0.5 rounded-full">
              {yearlyDiscountPercentage}% off
            </span>
          )}
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <span className="text-2xl font-bold">{price}</span>
        <div className="h-8 w-px bg-white/20"></div>
        <span className="text-sm italic opacity-70">{period}</span>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((item, index) => (
          <li key={index} className="flex items-center justify-between text-sm">
            <span>{item}</span>
            <span className="bg-[#1cc557] rounded-full h-5 w-5 flex items-center justify-center text-[10px] text-black font-bold">
              ✓
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handlePlanPurchase}
        className="mt-10 w-full bg-kidemia-pricing hover:bg-[#2aa2e6] text-white py-3 rounded-xl text-center font-medium transition"
      >
        Check out plan
      </button>
    </div>
  );
}