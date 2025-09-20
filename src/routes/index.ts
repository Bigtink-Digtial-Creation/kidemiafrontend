export const HomeRoutes = {
  home: "/",
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
};

export const TestRoutes = {
  takeTest: "/take-a-test",
  testSubjects: "/take-a-test/subjects",
};
export type HomeRoutes = (typeof HomeRoutes)[keyof typeof HomeRoutes];
export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
export type TestRoutes = (typeof TestRoutes)[keyof typeof TestRoutes];
