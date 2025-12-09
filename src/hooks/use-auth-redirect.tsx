import { useEffect, useRef, useState } from "react";
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
  const hasNavigated = useRef(false);

  useEffect(() => {
    hasNavigated.current = false;
    setIsValidating(true);

    const validateAuth = () => {
      const currentPath = location.pathname;

      if (!authToken) {
        if (loggedInUser) {
          setLoggedInUser(null);
        }
        if (userRole) {
          setUserRole(null);
        }

        if (requireAuth && !hasNavigated.current) {
          hasNavigated.current = true;
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

          if (requireAuth && !hasNavigated.current) {
            hasNavigated.current = true;
            navigate(AuthRoutes.login, { replace: true });
          }
          setIsValidating(false);
          return;
        }

        if (requireAuth && !loggedInUser) {
          setAuthToken(null);
          setUserRole(null);

          if (!hasNavigated.current) {
            hasNavigated.current = true;
            navigate(AuthRoutes.login, { replace: true });
          }
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
          currentPath !== AuthRoutes.emailVerificationRequired &&
          !hasNavigated.current
        ) {
          hasNavigated.current = true;
          navigate(AuthRoutes.emailVerificationRequired, { replace: true });
          setIsValidating(false);
          return;
        }

        if (!requireAuth && loggedInUser && !hasNavigated.current) {
          hasNavigated.current = true;
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

        if (requireAuth && !hasNavigated.current) {
          hasNavigated.current = true;
          navigate(AuthRoutes.login, { replace: true });
        }
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [
    loggedInUser,
    authToken,
    userRole,
    isEmailVerified,
    location.pathname,
    navigate,
    requireAuth,
    requireEmailVerification,
    setLoggedInUser,
    setAuthToken,
    setUserRole,
  ]);

  return { loggedInUser, authToken, userRole, isEmailVerified, isValidating };
}