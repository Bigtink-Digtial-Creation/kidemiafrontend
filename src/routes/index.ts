
export const HomeRoutes = {
  home: "/",
  about: "/about-us",
  test: "/test",
  subjects: "/subjects",
  contact: "/contact-us",
  privacy: "/privacy-policy",
  refund: "/refund-policy",
  terms: "/terms",
  faq: "/faqs"
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

  performance: "/performance",
  history: "/history",
  leaderboard: "/leaderboard",

  community: "/community",
  postPage: "/community/post/:postId",
  tagPage: "/community/tag/:tagId",
  userProfile: "/community/user/:userId",
  subjectPage: "/community/subject/:subjectId",
  notificationPage: "/community/notification",
  communityGuideLines: "/community/guidelines",
  profile: "/profile",
  settings: "/settings",

  takeAssessment: "/assessment",
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
  buytoken: "/token/top-up",
  upgradePlan: "/plan/upgrade",
  walletCallBack: "/wallet/callback",
  subscriptionCallBack: "/subscription/callback",
  subscriptionUpgrade: "/subscription/upgrade"
};


export type HomeRoutes = (typeof HomeRoutes)[keyof typeof HomeRoutes];
export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
export type TestRoutes = (typeof TestRoutes)[keyof typeof TestRoutes];
export type PaymentRoutes = (typeof PaymentRoutes)[keyof typeof PaymentRoutes];
export type AssessmentRoutes =
  (typeof AssessmentRoutes)[keyof typeof AssessmentRoutes];
