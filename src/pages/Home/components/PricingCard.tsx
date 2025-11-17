import { useState } from "react";
import { useNavigate } from "react-router";
export default function PricingCard({
  title,
  features,
}: {
  title: string;
  features: string[];
}) {
  const navigate = useNavigate();
  const handlePlanPurchase = () => {
    const planName = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/checkout/${planName}/plan?billing=${billingCycle}`);
  };

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual",
  );
  const price = billingCycle === "annual" ? "₦2100" : "₦500";
  const period = billingCycle === "annual" ? "per annum" : "per month";

  return (
    <div className="rounded-3xl bg-[#07182C] border border-white/10 p-6 md:p-8 shadow-lg">
      <h4 className="text-2xl font-semibold">
        <span className="text-[#FF8C22]">{title}</span>{" "}
        <span className="text-white">Plan</span>
      </h4>
      <div className="flex items-center mt-6 bg-white/5 p-1 rounded-full w-max">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-4 py-1 rounded-full text-sm transition-all duration-300 ${
            billingCycle === "monthly"
              ? "bg-white/20 backdrop-blur-md font-semibold scale-105 text-white"
              : "opacity-70 text-gray-300"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("annual")}
          className={`px-4 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${
            billingCycle === "annual"
              ? "bg-white/20 backdrop-blur-md font-semibold scale-105 text-white"
              : "opacity-70 text-gray-300"
          }`}
        >
          Annual
          {billingCycle === "annual" && (
            <span className="text-[10px] bg-[#1cc557] text-black px-2 py-0.5 rounded-full">
              20% off
            </span>
          )}
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <span className="text-5xl font-bold">{price}</span>
        <div className="h-8 w-px bg-white/20"></div>
        <span className="text-sm italic opacity-70">{period}</span>
      </div>
      <ul className="mt-8 space-y-4">
        {features.map((item) => (
          <li key={item} className="flex items-center justify-between text-sm">
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
