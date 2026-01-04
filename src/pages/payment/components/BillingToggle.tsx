export const BillingToggle = ({ isYearly, onToggle }: { isYearly: boolean; onToggle: (isYearly: boolean) => void }) => {
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
