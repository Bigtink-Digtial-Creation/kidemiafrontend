import { useAtomValue } from "jotai";
import { Navigate, Outlet } from "react-router";
import { userRoleAtom } from "../store/user.atom";
import { AuthRoutes } from "../routes";
import { useAuthRedirect } from "../hooks/use-auth-redirect";
import SpinnerCircle from "./Spinner/Circle";

type ProtectedRouteProps = {
    allowedRoles: string[];
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {

    const { loggedInUser, authToken, isValidating } = useAuthRedirect(true);

    // console.log(loggedInUser?.user?.student?.category_id)
    const userRole = useAtomValue(userRoleAtom);
    if (isValidating) {
        return <>
            <div className="h-screen flex justify-center items-center">
                < SpinnerCircle />
            </div>
        </>;
    }
    if (!authToken || !loggedInUser) {
        return null;
    }

    if (!userRole) {
        return <Navigate to={AuthRoutes.unauthorized} replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={AuthRoutes.unauthorized} replace />;
    }

    return <Outlet />;
}