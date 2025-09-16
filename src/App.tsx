import { createBrowserRouter } from "react-router";
import { AuthRoutes, HomeRoutes, SidebarRoutes } from "./routes";

//layouts
import HomeLayout from "./layouts/Home.layout";
import AuthLayout from "./layouts/Auth.layout";
import DashboardLayout from "./layouts/Dashboard.layout";

//pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/Login";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ChangePasswordPage from "./pages/Auth/ChangePassword";
import SignUpPage from "./pages/Auth/Signup";
import GuardianSignup from "./pages/Auth/Guardian";
import DashboardPage from "./pages/Dashboard";
import PerformancePage from "./pages/Performance";

import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [{ path: HomeRoutes.home, element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: AuthRoutes.login,
        element: <LoginPage />,
      },
      {
        path: AuthRoutes.forgotPassword,
        element: <ForgotPasswordPage />,
      },
      {
        path: AuthRoutes.changePassword,
        element: <ChangePasswordPage />,
      },
      {
        path: AuthRoutes.signup,
        element: <SignUpPage />,
      },
      {
        path: AuthRoutes.guardian,
        element: <GuardianSignup />,
      },
    ],
  },
  {
    path: SidebarRoutes.dashboard,
    element: <DashboardLayout />,
    children: [
      {
        path: SidebarRoutes.dashboard,
        element: <DashboardPage />,
      },
      {
        path: SidebarRoutes.performance,
        element: <PerformancePage />,
      },
    ],
  },
]);
