import { createBrowserRouter } from "react-router";
import { AuthRoutes, HomeRoutes, SidebarRoutes, TestRoutes } from "./routes";

//layouts
import HomeLayout from "./layouts/Home.layout";
import AuthLayout from "./layouts/Auth.layout";
import DashboardLayout from "./layouts/Dashboard.layout";
import TestLayout from "./layouts/Test.layout";

//pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/Login";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ChangePasswordPage from "./pages/Auth/ChangePassword";
import SignUpPage from "./pages/Auth/Signup";
import GuardianSignup from "./pages/Auth/Guardian";
import DashboardPage from "./pages/Dashboard";
import PerformancePage from "./pages/Performance";
import TakeTestPage from "./pages/TakeTest";
import TestSubjectsPage from "./pages/TakeTest/TestSubjects";
import TestTopicsPage from "./pages/TakeTest/TestTopics";
import TestInstrusctionsPage from "./pages/TakeTest/TestInstrusctions";
import QuestionsPage from "./pages/TakeTest/Questions";
import ResultPage from "./pages/TakeTest/Result";

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
  {
    element: <TestLayout />,
    children: [
      {
        path: TestRoutes.takeTest,
        element: <TakeTestPage />,
      },
      {
        path: TestRoutes.testSubjects,
        element: <TestSubjectsPage />,
      },
      {
        path: TestRoutes.subjectTopics,
        element: <TestTopicsPage />,
      },
      {
        path: TestRoutes.testIntructions,
        element: <TestInstrusctionsPage />,
      },
      {
        path: TestRoutes.questions,
        element: <QuestionsPage />,
      },
      {
        path: TestRoutes.results,
        element: <ResultPage />,
      },
    ],
  },
]);
