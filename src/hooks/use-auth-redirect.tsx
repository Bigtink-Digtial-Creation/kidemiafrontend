import { useEffect, useRef, useState, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate, useLocation } from "react-router";
import { jwtDecode } from "jwt-decode";
import {
    loggedinUserAtom,
    storedAuthTokenAtom,
    userRoleAtom,
    emailVerifiedAtom,
} from "../store/user.atom";
import { AuthRoutes, SidebarRoutes } from "../routes";

interface JWTPayload {
    exp: number;
    iat: number;
}

export function useAuthRedirect(
    requireAuth = true,
    requireEmailVerification = false
) {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggedInUser, setLoggedInUser] = useAtom(loggedinUserAtom);
    const [authToken, setAuthToken] = useAtom(storedAuthTokenAtom);
    const [userRole, setUserRole] = useAtom(userRoleAtom);
    const isEmailVerified = useAtomValue(emailVerifiedAtom);
    const [isValidating, setIsValidating] = useState(true);

    // Track last validated state to prevent unnecessary re-validations
    const lastValidatedState = useRef({
        authToken: null as string | null,
        loggedInUser: null as any,
        userRole: null as string | null,
        isEmailVerified: false,
        pathname: "",
    });

    const validateAuth = useCallback(() => {
        const currentPath = location.pathname;

        // Skip validation if state hasn't changed
        const stateChanged =
            lastValidatedState.current.authToken !== authToken ||
            lastValidatedState.current.loggedInUser !== loggedInUser ||
            lastValidatedState.current.userRole !== userRole ||
            lastValidatedState.current.isEmailVerified !== isEmailVerified ||
            lastValidatedState.current.pathname !== currentPath;

        if (!stateChanged) {
            setIsValidating(false);
            return;
        }

        // Update tracked state
        lastValidatedState.current = {
            authToken,
            loggedInUser,
            userRole,
            isEmailVerified,
            pathname: currentPath,
        };

        setIsValidating(true);

        if (!authToken) {
            if (loggedInUser) {
                setLoggedInUser(null);
            }
            if (userRole) {
                setUserRole(null);
            }

            if (requireAuth) {
                navigate(AuthRoutes.login, { replace: true });
            }
            setIsValidating(false);
            return;
        }

        try {
            const decoded = jwtDecode<JWTPayload>(authToken);
            if (!decoded.exp) {
                throw new Error("Token missing expiration");
            }

            const expireAt = decoded.exp * 1000;
            const now = Date.now();
            const CLOCK_SKEW_BUFFER = 5000;

            if (expireAt - CLOCK_SKEW_BUFFER < now) {
                setAuthToken(null);
                setLoggedInUser(null);
                setUserRole(null);

                if (requireAuth) {
                    navigate(AuthRoutes.login, { replace: true });
                }
                setIsValidating(false);
                return;
            }

            if (requireAuth && !loggedInUser) {
                setAuthToken(null);
                setUserRole(null);
                navigate(AuthRoutes.login, { replace: true });
                setIsValidating(false);
                return;
            }

            if (loggedInUser && !userRole) {
                const storedRole = loggedInUser.user?.roles?.[0].name ?? null;
                setUserRole(storedRole);
            }

            if (
                requireEmailVerification &&
                !isEmailVerified &&
                currentPath !== AuthRoutes.emailVerificationRequired
            ) {
                navigate(AuthRoutes.emailVerificationRequired, { replace: true });
                setIsValidating(false);
                return;
            }

            if (!requireAuth && loggedInUser) {
                navigate(SidebarRoutes.dashboard, { replace: true });
                setIsValidating(false);
                return;
            }

            setIsValidating(false);
        } catch (err) {
            console.error("Token validation error:", err);
            setAuthToken(null);
            setLoggedInUser(null);
            setUserRole(null);

            if (requireAuth) {
                navigate(AuthRoutes.login, { replace: true });
            }
            setIsValidating(false);
        }
    }, [
        authToken,
        loggedInUser,
        userRole,
        isEmailVerified,
        location.pathname,
        requireAuth,
        requireEmailVerification,
        navigate,
        setAuthToken,
        setLoggedInUser,
        setUserRole,
    ]);

    useEffect(() => {
        validateAuth();
    }, [validateAuth]);

    return { loggedInUser, authToken, userRole, isEmailVerified, isValidating };
}