import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Check } from "lucide-react";

export const PricingCardTwo = ({
    name,
    description,
    price,
    yearlyPrice,
    currency,
    isYearly,
    features,
    isCurrentPlan,
    onSelect,
}: {
    name: string;
    description?: string,
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
                    <h3 className="text-md font-semibold text-gray-900">
                        {name}
                    </h3>

                    <div className="flex items-baseline gap-1">
                        <sup className="text-xs font-normal">{currency}</sup>
                        <span className="text-xl font-bold text-gray-900">
                            {displayPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-600 text-sm">
                            /{isYearly ? "yr" : "mo"}
                        </span>
                    </div>
                    {description != null && description !== "" && (
                        <p className="text-sm font-normal text-kidemia-black">{description}</p>)}
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
                    onPress={onSelect}
                    disabled={isCurrentPlan}
                    className={`w-full ${isCurrentPlan
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-kidemia-primary text-white hover:bg-kidemia-primary/90"
                        }`}
                >
                    {isCurrentPlan ? "Current Plan" : "Upgrade"}
                </Button>
            </CardBody>
        </Card>
    );
};