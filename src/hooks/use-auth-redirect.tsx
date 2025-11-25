import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { loggedinUserAtom, storedAuthTokenAtom, userRoleAtom } from "../store/user.atom";
import { AuthRoutes, SidebarRoutes } from "../routes";

interface JWTPayload {
  exp: number;
  iat: number;
}

export function useAuthRedirect(requireAuth = true) {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useAtom(loggedinUserAtom);
  const [authToken, setAuthToken] = useAtom(storedAuthTokenAtom);
  const [userRole, setUserRole] = useAtom(userRoleAtom);
  const [isValidating, setIsValidating] = useState(true);
  const hasNavigated = useRef(false);

  useEffect(() => {
    hasNavigated.current = false;
    setIsValidating(true);

    const validateAuth = () => {
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

        // Re-sync role from stored user data on refresh
        if (loggedInUser && !userRole) {
          const storedRole = loggedInUser.user?.roles?.[0].name ?? null;
          setUserRole(storedRole);
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
    navigate,
    requireAuth,
    setLoggedInUser,
    setAuthToken,
    setUserRole,
  ]);

  return { loggedInUser, authToken, isValidating };
}