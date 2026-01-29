import type { IconType } from "react-icons";
import { UserRole } from "../../utils/enums";
import { GuardianRoutes, PaymentRoutes, SidebarRoutes } from "../../routes";
import {
  MdManageHistory,
  MdOutlineDashboard,
  MdLeaderboard,
  MdPeople,
  MdWallet,
} from "react-icons/md";
import { CgPerformance } from "react-icons/cg";
import { FiBarChart2, FiHome } from "react-icons/fi";
import { FaCircleQuestion, FaSignsPost } from "react-icons/fa6";

export type SidebarLinkT = {
  title: string;
  icon: IconType;
  allowedRoles?: UserRole[];
  subText?: string;
  pathname: SidebarRoutes;
};

export const sidebarLinks: SidebarLinkT[] = [
  {
    title: "Dashboard",
    icon: MdOutlineDashboard,
    allowedRoles: [UserRole.STUDENT],
    pathname: SidebarRoutes.dashboard,
  },
  {
    title: "Performance",
    icon: CgPerformance,
    allowedRoles: [UserRole.STUDENT],
    pathname: SidebarRoutes.performance,
  },
  {
    title: "History",
    icon: MdManageHistory,
    allowedRoles: [UserRole.STUDENT],
    pathname: SidebarRoutes.history,
  },
  {
    title: "Leaderboard",
    icon: MdLeaderboard,
    allowedRoles: [UserRole.STUDENT],
    pathname: SidebarRoutes.leaderboard,
  },
  {
    title: "Communities",
    icon: MdPeople,
    allowedRoles: [UserRole.STUDENT],
    pathname: SidebarRoutes.community,
  },

  {
    title: "Buy Token",
    icon: MdWallet,
    allowedRoles: [UserRole.STUDENT],
    pathname: PaymentRoutes.buytoken,
  },


  // Guardian Links 
  {
    title: "Dashboard",
    pathname: GuardianRoutes.dashboard,
    icon: FiHome,
    allowedRoles: [UserRole.GUARDIAN],
  },

  {
    title: "Request",
    pathname: GuardianRoutes.categoryRequests,
    icon: FaCircleQuestion,
    allowedRoles: [UserRole.GUARDIAN],
  },
  {
    title: "Monitor",
    pathname: GuardianRoutes.monitor,
    icon: FaSignsPost,
    allowedRoles: [UserRole.GUARDIAN],
  },
  {
    title: "Reports",
    pathname: GuardianRoutes.comprehensiveReport,
    icon: FiBarChart2,
    allowedRoles: [UserRole.GUARDIAN],
  },

];
