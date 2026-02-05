import { useAtomValue } from "jotai";
import { Navigate, Outlet, useLocation } from "react-router";
import { userRoleAtom, emailVerifiedAtom } from "../store/user.atom";
import { AuthRoutes } from "../routes";
import SpinnerCircle from "./Spinner/Circle";
import { useAuthRedirect } from "../hooks/use-auth-redirect";

type ProtectedRouteProps = {
    allowedRoles: string[];
    requireEmailVerification?: boolean;
};

export function ProtectedRoute({
    allowedRoles,
    requireEmailVerification = true,
}: ProtectedRouteProps) {
    const location = useLocation();

    const isOnVerificationPage = location.pathname === AuthRoutes.emailVerificationRequired;

    const { loggedInUser, authToken, isValidating } = useAuthRedirect(
        true,
        requireEmailVerification && !isOnVerificationPage
    );

    const userRole = useAtomValue(userRoleAtom);
    const isEmailVerified = useAtomValue(emailVerifiedAtom);

    if (isValidating || (loggedInUser && !userRole)) {
        return (
            <div className="h-screen flex justify-center items-center">
                <SpinnerCircle />
            </div>
        );
    }

    if (!authToken || !loggedInUser) {
        return null;
    }

    if (requireEmailVerification && !isEmailVerified && !isOnVerificationPage) {
        return <Navigate to={AuthRoutes.emailVerificationRequired} replace />;
    }

    if (!userRole) {
        return <Navigate to={AuthRoutes.unauthorized} replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={AuthRoutes.unauthorized} replace />;
    }

    return <Outlet />;
}