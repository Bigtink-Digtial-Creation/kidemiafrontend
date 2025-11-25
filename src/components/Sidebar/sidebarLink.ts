import type { IconType } from "react-icons";
import { UserRole } from "../../utils/enums";
import { SidebarRoutes } from "../../routes";
import {
  MdManageHistory,
  MdOutlineDashboard,
  MdLeaderboard,
  MdPeople,
} from "react-icons/md";
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
  {
    title: "History",
    icon: MdManageHistory,
    allowedRoles: [UserRole.SCHOOL, UserRole.STUDENT, UserRole.GUARDIAN],
    pathname: SidebarRoutes.history,
  },
  {
    title: "Leaderboard",
    icon: MdLeaderboard,
    allowedRoles: [UserRole.SCHOOL, UserRole.STUDENT, UserRole.GUARDIAN],
    pathname: SidebarRoutes.leaderboard,
  },
  {
    title: "Communities",
    icon: MdPeople,
    allowedRoles: [UserRole.SCHOOL, UserRole.STUDENT],
    pathname: SidebarRoutes.community,
  },
];
