import type { IconType } from "react-icons";
import { UserRole } from "../../utils/enums";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard } from "react-icons/md";
import { CgPerformance } from "react-icons/cg";

export type SidebarLinkT = {
  title: string;
  icon: IconType;
  allowedRoles?: UserRole[];
  pathname: SidebarRoutes;
};

export const sidebarLinks: SidebarLinkT[] = [
  {
    title: "Dashboard",
    icon: MdOutlineDashboard,
    allowedRoles: [UserRole.SCHOOL, UserRole.STUDENT, UserRole.GUARDIAN],
    pathname: SidebarRoutes.dashboard,
  },
  {
    title: "Performance",
    icon: CgPerformance,
    allowedRoles: [UserRole.SCHOOL, UserRole.STUDENT, UserRole.GUARDIAN],
    pathname: SidebarRoutes.performance,
  },
];
