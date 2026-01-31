import { createBrowserRouter } from "react-router";
import {
  AssessmentRoutes,
  AuthRoutes,
  HomeRoutes,
  SidebarRoutes,
  TestRoutes,
  PaymentRoutes,
  GuardianRoutes,
  WardRoutes
} from "./routes";

import { ProtectedRoute } from "./components/ProtectedRoute";

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
import ForgotPasswordPage from "./pages/Auth/Password/ForgotPassword";
import ChangePasswordPage from "./pages/Auth/Password/ChangePassword";
import SignUpPage from "./pages/Auth/Signup";
import GuardianSignup from "./pages/Auth/Guardian";


// dashboard pages
import DashboardPage from "./pages/Dashboard";
import PerformancePage from "./pages/Performance";
import TakeTestPage from "./pages/TakeTest";
import TestSubjectsPage from "./pages/TakeTest/TestSubjects";
import TestTopicsPage from "./pages/TakeTest/TestTopics";
import TestInstructionsPage from "./pages/TakeTest/TestInstructions";
import QuestionsPage from "./pages/TakeTest/Questions";
import ResultPage from "./pages/TakeTest/Result";
import ReviewSubmission from "./pages/TakeTest/ReviewSubmission";
import HistoryPage from "./pages/History";
import SettingsPage from "./pages/Settings";
import AssessmentPage from "./pages/Assessment";
import AssessmentInstruction from "./pages/Assessment/AssessmentInstruction";
import AssessmentResult from "./pages/Assessment/AssessmentResult";
import TestDetails from "./pages/TakeTest/TestDetails";
import TestAttempt from "./pages/TakeTest/TestAttempt";

import LeaderboardPage from "./pages/LeaderBoard";
import CommunityPage from "./pages/Community/Feed";

import ErrorPage from "./pages/ErrorPage";
import UnauthorizedPage from "./pages/Auth/Login/unauthorized";
import { CorrectionPage } from "./pages/Correction";
import ProfilePage from "./pages/Profile";
import ResetPasswordPage from "./pages/Auth/Password/ResetPassword";
import VerifyEmailPage from "./pages/Auth/Password/VerifyEmail";
import EmailVerificationRequiredPage from "./pages/Auth/Password/EmailVerificationRequired";
import BuyUnitsPage from "./pages/payment/BuyUnitsPage";
import WalletCallbackPage from "./pages/payment/WalletCallbackPage";
import CheckOutPage from "./pages/payment/Checkout";
import PostDetailPage from "./pages/Community/Feed/PostDetailPage";
import TagPage from "./pages/Community/Feed/TagPage";
import UserProfilePage from "./pages/Community/Feed/UserProfilePage";
import { SubjectPage } from "./pages/Community/Feed/SubjectPage";
import NotificationsPage from "./pages/Community/NotificationsPage";
import CommunityGuidelinesPage from "./pages/Community/CommunityGuidelinesPage";
import { RefundPolicyPage } from "./pages/Home/RefundPolicyPage";
import { PrivacyPolicyPage } from "./pages/Home/PrivacyPolicy";
import { TermsOfServicePage } from "./pages/Home/TermsOfServicePage";
import { FAQPage } from "./pages/Home/FAQPage";
import EmailLayout from "./layouts/Email.layout";
import SubscriptionCallbackPage from "./pages/payment/SubscriptionCallbackPage";
import WardReportPage from "./pages/Guardian/WardReportPage";
import GuardianDashboard from "./pages/Guardian";
import ComprehensiveReportPage from "./pages/Guardian/ComprehensiveReportPage";
import CategoryRequestsPage from "./pages/Guardian/CategoryRequestsPage";
import GuardianSubscriptionPage from "./pages/Guardian/GuardianSubscriptionPage";
import CreateChallengeAssessment from "./pages/Guardian/CreateAssessmentPage";
import GuardianMonitoringDashboard from "./pages/Guardian/Monitoringdashboard";
import WardChallengeList from "./pages/Challenge/MyChallengeList";
import AssessmentPreparation from "./pages/Challenge/Assessmentpreparation";
import ProctoredAssessmentQuestions from "./pages/Challenge/ProctoredAssessmentQuestion";
import AssessmentAttempt from "./pages/Assessment/AssessmentAttempt";
import AssessmentQuestions from "./pages/Assessment/AssessmentQuestions";
import AssignmentDetailPage from "./pages/Guardian/AssignmentDetailPage";
import SubscriptionDashboard from "./pages/payment/PricingUpgrade";
import StudentAnalyticsDashboard from "./pages/Analytics/StudentAnalyticsDashboard";

export const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: HomeRoutes.home, element: <Home /> },
      { path: HomeRoutes.contact, element: <ContactUs /> },
      { path: HomeRoutes.about, element: <AboutUs /> },
      { path: HomeRoutes.refund, element: <RefundPolicyPage /> },
      { path: HomeRoutes.privacy, element: <PrivacyPolicyPage /> },
      { path: HomeRoutes.terms, element: <TermsOfServicePage /> },
      { path: HomeRoutes.faq, element: <FAQPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: AuthRoutes.login, element: <LoginPage /> },
      { path: AuthRoutes.forgotPassword, element: <ForgotPasswordPage /> },
      { path: AuthRoutes.changePassword, element: <ChangePasswordPage /> },
      { path: AuthRoutes.resetPassword, element: <ResetPasswordPage /> },
      { path: AuthRoutes.signup, element: <SignUpPage /> },
      { path: AuthRoutes.guardian, element: <GuardianSignup /> },
    ],
  },
  {
    element: <EmailLayout />,
    errorElement: <ErrorPage />,
    children: [{
      path: AuthRoutes.verifyEmail,
      element: <VerifyEmailPage />,
    },]
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["guardian"]} requireEmailVerification={true} />
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: GuardianRoutes.dashboard, element: <GuardianDashboard /> },
          { path: GuardianRoutes.settings, element: <SettingsPage /> },
          { path: GuardianRoutes.wardReport, element: <WardReportPage /> },
          { path: GuardianRoutes.monitor, element: <GuardianMonitoringDashboard /> },
          { path: GuardianRoutes.categoryRequests, element: <CategoryRequestsPage />, },
          { path: GuardianRoutes.comprehensiveReport, element: <ComprehensiveReportPage />, },
          { path: GuardianRoutes.notifications, element: <NotificationsPage /> },
          { path: GuardianRoutes.createAssessment, element: <CreateChallengeAssessment /> },
          { path: GuardianRoutes.assessmentDetail, element: <AssignmentDetailPage /> },
          { path: GuardianRoutes.subscription, element: <GuardianSubscriptionPage /> },


        ]
      },
    ]
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["student"]} requireEmailVerification={true} />
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: SidebarRoutes.dashboard, element: <DashboardPage /> },
          { path: SidebarRoutes.performance, element: <PerformancePage /> },
          { path: SidebarRoutes.history, element: <HistoryPage /> },
          { path: SidebarRoutes.leaderboard, element: <LeaderboardPage /> },
          { path: SidebarRoutes.community, element: <CommunityPage /> },
          { path: SidebarRoutes.notificationPage, element: <NotificationsPage /> },
          { path: SidebarRoutes.postPage, element: <PostDetailPage /> },
          { path: SidebarRoutes.tagPage, element: <TagPage /> },
          { path: SidebarRoutes.userProfile, element: <UserProfilePage /> },
          { path: SidebarRoutes.subjectPage, element: <SubjectPage /> },
          { path: SidebarRoutes.communityGuideLines, element: <CommunityGuidelinesPage /> },
          { path: SidebarRoutes.takeAssessment, element: <AssessmentPage /> },
          { path: PaymentRoutes.buytoken, element: <BuyUnitsPage /> },
          { path: SidebarRoutes.settings, element: <SettingsPage /> },

          // Challenges
          { path: WardRoutes.challenges, element: <WardChallengeList /> },
          { path: WardRoutes.assessmentInstructions, element: <AssessmentPreparation /> },
          { path: WardRoutes.questions, element: <ProctoredAssessmentQuestions /> },

          // Assessment - PAID - EXAM
          { path: AssessmentRoutes.assesmentAttempt, element: <AssessmentAttempt /> },
          { path: AssessmentRoutes.assessmentQuestion, element: <AssessmentQuestions /> },


          // Analytics
          { path: SidebarRoutes.analytics, element: <StudentAnalyticsDashboard /> },




        ],
      },

      {
        element: <TestLayout />,
        children: [
          { path: TestRoutes.takeTest, element: <TakeTestPage /> },
          { path: TestRoutes.testSubjects, element: <TestSubjectsPage /> },
          { path: TestRoutes.subjectTopics, element: <TestTopicsPage /> },
          { path: TestRoutes.testInstructions, element: <TestInstructionsPage /> },
          { path: TestRoutes.testDetails, element: <TestDetails /> },
          { path: TestRoutes.testAttempt, element: <TestAttempt /> },
          { path: TestRoutes.questions, element: <QuestionsPage /> },
          { path: TestRoutes.review, element: <ReviewSubmission /> },
          { path: AssessmentRoutes.assessmentInstructions, element: <AssessmentInstruction /> },


          // Challenge

        ],
      },

      { path: TestRoutes.results, element: <ResultPage /> },
      {
        path: AssessmentRoutes.assessmentResult,
        element: <AssessmentResult />,
      },
      {
        path: AssessmentRoutes.assessmentCorrection,
        element: <CorrectionPage />,
      },
      {
        path: PaymentRoutes.walletCallBack,
        element: <WalletCallbackPage />,
      }

    ]
  },



  {
    path: AuthRoutes.unauthorized,
    element: <UnauthorizedPage />
  },
  {
    path: AuthRoutes.emailVerificationRequired,
    element: <EmailVerificationRequiredPage />,
    errorElement: <ErrorPage />
  },


  {
    element: (
      <ProtectedRoute allowedRoles={["student", "guardian"]} requireEmailVerification={true} />
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: PaymentRoutes.subscriptionUpgrade,
            element: <SubscriptionDashboard />,
          },
          {
            path: PaymentRoutes.subscriptionCallBack,
            element: <SubscriptionCallbackPage />,
          },

          { path: SidebarRoutes.profile, element: <ProfilePage /> },


        ]
      },
    ]
  },
  {
    path: PaymentRoutes.checkout,
    element: <CheckOutPage />,
    errorElement: <ErrorPage />,
  },


])