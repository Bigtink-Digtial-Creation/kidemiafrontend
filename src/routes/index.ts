export const HomeRoutes = {
  home: "/",
  about: "/about-us",
  test: "/test",
  subjects: "/subjects",
  contact: "/contact-us",
};

export const AuthRoutes = {
  login: "/auth/login",
  signup: "/auth/signup",
  unauthorized: "/auth/unauthorized",
  guardian: "/auth/signup/guardian",
  forgotPassword: "/auth/forgot-password",
  changePassword: "/auth/change-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
  emailVerificationRequired: "/auth/verification-required",

  resendVerification: "/auth/resend-verification",
};

export const SidebarRoutes = {
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  performance: "/dashboard/performance",
  history: "/dashboard/history",
  leaderboard: "/dashboard/leaderboard",
  profile: "/dashboard/profile",
  takeAssessment: "/dashboard/assessment",
  community: "/dashboard/community",
  postPage: "/dashboard/community/post/:postId",

};

export const TestRoutes = {
  takeTest: "/take-a-test",
  testSubjects: "/take-a-test/subjects",
  subjectTopics: "/take-a-test/subjects/:id",
  testInstructions: "/take-a-test/:id/instructions",
  testDetails: "/take-a-test/:id/details",
  testAttempt: "/take-a-test/start/:assessmentId",
  questions: "/take-a-test/:assessment_id/:attempt_id/questions",
  results: "/take-a-test/results/:assessment_id",
  review: "/take-a-test/review-submission",
};

export const AssessmentRoutes = {
  assessmentInstructions: "/assessment/instructions/:id",
  assesmentAttempt: "/assessment/:assessmentId/attempt-instructions",
  assessmentQuestion: "/assessment/:assessment_id/:attempt_id/questions",
  assessmentResult: "/assessment/result/:assessment_id",
  assessmentCorrection: "/assessment/:attemptId/corrections",
};

export const PaymentRoutes = {
  checkout: "/payment/checkout/:id/plan",
  buytoken: "/dashboard/token/top-up",
  walletCallBack: '/wallet/callback',
  upgradePlan: '/dashboard/plan/upgrade'
};

export type HomeRoutes = (typeof HomeRoutes)[keyof typeof HomeRoutes];
export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
export type TestRoutes = (typeof TestRoutes)[keyof typeof TestRoutes];
export type PaymentRoutes = (typeof PaymentRoutes)[keyof typeof PaymentRoutes];
export type AssessmentRoutes =
  (typeof AssessmentRoutes)[keyof typeof AssessmentRoutes];
