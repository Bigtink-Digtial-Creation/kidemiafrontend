import { createBrowserRouter } from "react-router";
import {
  AssessmentRoutes,
  AuthRoutes,
  HomeRoutes,
  SidebarRoutes,
  TestRoutes,
  PaymentRoutes,
} from "./routes";

//layouts
import HomeLayout from "./layouts/Home.layout";
import AuthLayout from "./layouts/Auth.layout";
import DashboardLayout from "./layouts/Dashboard.layout";
import TestLayout from "./layouts/Test.layout";

// home pages
import Home from "./pages/Home";
import ContactUs from "./pages/Home/ContactUs";
import AboutUs from "./pages/Home/AboutUs";

// auth pages
import LoginPage from "./pages/Auth/Login";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ChangePasswordPage from "./pages/Auth/ChangePassword";
import SignUpPage from "./pages/Auth/Signup";
import GuardianSignup from "./pages/Auth/Guardian";

// Payment pages
import SubscriptionPage from "./pages/payment/Checkout";

// dashboard pages
import DashboardPage from "./pages/Dashboard";
import PerformancePage from "./pages/Performance";
import TakeTestPage from "./pages/TakeTest";
import TestSubjectsPage from "./pages/TakeTest/TestSubjects";
import TestTopicsPage from "./pages/TakeTest/TestTopics";
import TestInstrusctionsPage from "./pages/TakeTest/TestInstrusctions";
import QuestionsPage from "./pages/TakeTest/Questions";
import ResultPage from "./pages/TakeTest/Result";
import ReviewSubmission from "./pages/TakeTest/ReviewSubmission";
import HistoryPage from "./pages/History";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import AssessmentPage from "./pages/Assessment";
import AssessmentInstruction from "./pages/Assessment/AssessmentInstruction";
import AssessmentAttempt from "./pages/Assessment/AssessmentAttempt";
import AssessmentQuestions from "./pages/Assessment/AssessmentQuestions";
import AssessmentResult from "./pages/Assessment/AssessmentResult";
import TestDetails from "./pages/TakeTest/TestDetails";
import TestAttempt from "./pages/TakeTest/TestAttempt";

import LeaderboardPage from "./pages/LeaderBoard";

import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: HomeRoutes.home, element: <Home /> },
      { path: HomeRoutes.contact, element: <ContactUs /> },
      { path: HomeRoutes.about, element: <AboutUs /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: AuthRoutes.login, element: <LoginPage /> },
      { path: AuthRoutes.forgotPassword, element: <ForgotPasswordPage /> },
      { path: AuthRoutes.changePassword, element: <ChangePasswordPage /> },
      { path: AuthRoutes.signup, element: <SignUpPage /> },
      { path: AuthRoutes.guardian, element: <GuardianSignup /> },
    ],
  },
  {
    path: SidebarRoutes.dashboard,
    element: <DashboardLayout />,
    children: [
      { path: SidebarRoutes.dashboard, element: <DashboardPage /> },
      { path: SidebarRoutes.performance, element: <PerformancePage /> },
      { path: SidebarRoutes.history, element: <HistoryPage /> },
      { path: SidebarRoutes.leaderboard, element: <LeaderboardPage /> },
      { path: SidebarRoutes.profile, element: <ProfilePage /> },
      { path: SidebarRoutes.settings, element: <SettingsPage /> },
      { path: SidebarRoutes.takeAssessment, element: <AssessmentPage /> },
    ],
  },
  {

  },
  {
    element: <TestLayout />,
    children: [
      { path: TestRoutes.takeTest, element: <TakeTestPage /> },
      { path: TestRoutes.testSubjects, element: <TestSubjectsPage /> },
      { path: TestRoutes.subjectTopics, element: <TestTopicsPage /> },
      { path: TestRoutes.testInstructions, element: <TestInstrusctionsPage /> },
      { path: TestRoutes.testDetails, element: <TestDetails /> },
      { path: TestRoutes.testAttempt, element: <TestAttempt /> },
      { path: TestRoutes.questions, element: <QuestionsPage /> },
      { path: TestRoutes.results, element: <ResultPage /> },
      { path: TestRoutes.review, element: <ReviewSubmission /> },
      {
        path: AssessmentRoutes.assessmentInstructions,
        element: <AssessmentInstruction />,
      },
      {
        path: AssessmentRoutes.assesmentAttempt,
        element: <AssessmentAttempt />,
      },
      {
        path: AssessmentRoutes.assessmentQuestion,
        element: <AssessmentQuestions />,
      },

    ],

  },
  {
    path: AssessmentRoutes.assessmentResult,
    element: <AssessmentResult />,
  },

  {
    path: PaymentRoutes.checkout,
    element: <SubscriptionPage />,
  },
]);
