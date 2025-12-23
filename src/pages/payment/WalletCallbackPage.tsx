import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { PaymentRoutes } from "../../routes";

export default function WalletCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const reference = searchParams.get("reference") || searchParams.get("tx_ref");

        if (reference) {
            navigate(`${PaymentRoutes.buytoken}?reference=${reference}`);
        } else {
            navigate(PaymentRoutes.buytoken, { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-kidemia-dark">Processing...</h2>
                <p className="text-kidemia-grey">
                    Redirecting you back to the app
                </p>
            </div>
        </div>
    );
}
