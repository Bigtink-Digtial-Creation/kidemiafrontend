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

export type HomeRoutes = (typeof HomeRoutes)[keyof typeof HomeRoutes];
export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
