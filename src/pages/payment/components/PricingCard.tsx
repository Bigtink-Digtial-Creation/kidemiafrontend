interface PricingCardProps {
    planData: any;
    billing: "monthly" | "annual";
    onBillingToggle: (billing: "monthly" | "annual") => void;
    promoCode: string;
    setPromoCode: (code: string) => void;
    promoError: string;
    appliedPromo: any;
    onApplyPromo: () => void;
    isApplyingPromo: boolean;
    calculatePrice: () => string;
}

export default function PricingCard({
    planData,
    billing,
    onBillingToggle,
    promoCode,
    setPromoCode,
    promoError,
    appliedPromo,
    onApplyPromo,
    isApplyingPromo,
    calculatePrice,
}: PricingCardProps) {
    return (
        <div className="bg-gradient-to-br from-[#07182C] to-[#0a1f35] border border-[#FF8C22]/20 rounded-3xl p-8 shadow-2xl col-span-1 h-fit lg:sticky lg:top-4">
            <h3 className="text-3xl font-bold mb-2">
                <span className="text-[#FF8C22]">{planData.plan_name}</span>
            </h3>

            {planData.tagline && (
                <p className="text-sm opacity-70 mb-6">{planData.tagline}</p>
            )}

            {/* Billing Toggle */}
            <div className="flex items-center mt-6 bg-white/5 p-1 rounded-full w-max">
                <button
                    onClick={() => onBillingToggle("monthly")}
                    className={`px-5 py-2 rounded-full text-sm transition-all ${billing === "monthly"
                        ? "bg-white/20 backdrop-blur-md font-semibold text-white"
                        : "opacity-60 text-gray-300 hover:opacity-80"
                        }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => onBillingToggle("annual")}
                    className={`px-5 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${billing === "annual"
                        ? "bg-white/20 backdrop-blur-md font-semibold text-white"
                        : "opacity-60 text-gray-300 hover:opacity-80"
                        }`}
                >
                    Annual
                    {billing === "annual" && planData.yearly_discount_percentage > 0 && (
                        <span className="text-[10px] bg-[#1cc557] text-black px-2 py-1 rounded-full font-bold">
                            {planData.yearly_discount_percentage}% off
                        </span>
                    )}
                </button>
            </div>

            {/* Price */}
            <div className="mt-8 flex items-center gap-4">
                <div className="flex flex-col">
                    {appliedPromo && (
                        <span className="text-2xl line-through opacity-50">
                            {planData.currency}{billing === "annual" ? planData.price_yearly : planData.price_monthly}
                        </span>
                    )}
                    <span className="text-2xl font-bold text-[#FF8C22]">
                        {planData.currency}{calculatePrice()}
                    </span>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <span className="text-sm italic opacity-70">
                    {billing === "annual" ? "per annum" : "per month"}
                </span>
            </div>

            {/* Promo Code */}
            <div className="mt-8">
                <label className="text-sm opacity-70 block mb-2">Have a promo code?</label>
                <div className="flex">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 bg-white/5 border border-white/10 py-2 px-2 rounded-xl text-sm focus:outline-none focus:border-kidemia-primary/50"
                    />
                    <button
                        onClick={onApplyPromo}
                        disabled={isApplyingPromo}
                        className="bg-kidemia-secondary hover:bg-kidemia-primary px-6 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50 ms-2"
                    >
                        {isApplyingPromo ? "..." : "Apply"}
                    </button>
                </div>
                {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
                {appliedPromo && (
                    <p className="text-[#1cc557] text-xs mt-2">
                        ✓ Promo applied! You saved {planData.currency}{appliedPromo.discount_amount}
                    </p>
                )}
            </div>

            {/* Features */}
            <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">What's included:</h4>
                <ul className="space-y-3">
                    {planData.benefits_list?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                            <span className="bg-[#1cc557] rounded-full h-5 w-5 flex items-center justify-center text-[10px] text-black font-bold mt-0.5 flex-shrink-0">
                                ✓
                            </span>
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}