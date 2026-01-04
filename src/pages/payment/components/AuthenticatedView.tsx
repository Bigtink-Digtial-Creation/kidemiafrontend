import { useSetAtom } from "jotai";
import { useNavigate, useLocation } from "react-router";
import { loggedinUserAtom, storedAuthTokenAtom, userRoleAtom } from "../../../store/user.atom";
import { ApiSDK } from "../../../sdk";
import { Loader2 } from "lucide-react";

interface AuthenticatedViewProps {
    user: any;
    onContinueToPayment: () => void;
    isProcessing?: boolean;

}

export default function AuthenticatedView({
    user,
    onContinueToPayment,
    isProcessing = false

}: AuthenticatedViewProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const setStoredToken = useSetAtom(storedAuthTokenAtom);
    const setLoggedInUser = useSetAtom(loggedinUserAtom);
    const setRole = useSetAtom(userRoleAtom);

    const handleLogout = () => {
        ApiSDK.OpenAPI.TOKEN = undefined;
        setStoredToken(null);
        setLoggedInUser(null);
        setRole(null);

        navigate(location.pathname + location.search, { replace: true });
    };

    return (
        <div className="space-y-4 max-w-md mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-[#1cc557] text-5xl mb-3">✓</div>
                <p className="text-lg font-semibold">You're signed in!</p>
                <p className="text-sm opacity-70 mt-1">
                    Welcome back, {user?.user?.first_name || user?.user?.email}
                </p>
                <p className="text-sm opacity-70 mt-1">Ready to complete your subscription</p>
            </div>
            <button
                onClick={onContinueToPayment}
                disabled={isProcessing}
                className="w-full bg-[#2AA2A0] hover:bg-[#2AA2A0]/80 text-white font-bold py-4 px-8 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

            > {isProcessing ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                </>
            ) : (
                "Continue to Payment"
            )}
            </button>
            <button
                onClick={handleLogout}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-xl text-sm transition"
            >
                Sign Out
            </button>
        </div>
    );
}