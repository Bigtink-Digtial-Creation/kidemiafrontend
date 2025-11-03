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
  guardian: "/auth/signup/guardian",
  forgotPassword: "/auth/forgot-password",
  changePassword: "/auth/change-password",
};

export const SidebarRoutes = {
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  performance: "/dashboard/performance",
  history: "/dashboard/history",
  profile: "/dashboard/profile",
  takeAssessment: "/dashboard/assessment",
};

export const TestRoutes = {
  takeTest: "/take-a-test",
  testSubjects: "/take-a-test/subjects",
  subjectTopics: "/take-a-test/subjects/:id",
  testIntructions: "/take-a-test/instructions",
  questions: "/take-a-test/questions",
  results: "/take-a-test/results",
  review: "/take-a-test/review-submission",
};

export const AssessmentRoutes = {
  assesmentIntructions: "/assessment/intructions/:id",
  assesmentQuestions: "/assessment/:id/questions",
};

export type HomeRoutes = (typeof HomeRoutes)[keyof typeof HomeRoutes];
export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
export type TestRoutes = (typeof TestRoutes)[keyof typeof TestRoutes];
export type AssessmentRoutes =
  (typeof AssessmentRoutes)[keyof typeof AssessmentRoutes];
