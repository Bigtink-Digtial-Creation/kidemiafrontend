import { SidebarRoutes, GuardianRoutes } from "../routes";


export const getDashboardPathByRole = (roleName: string | undefined | null): string => {
    switch (roleName) {
        case "guardian":
            return GuardianRoutes.dashboard;

        case "student":
            return SidebarRoutes.dashboard;

        case "institution_admin":
            return "/admin/dashboard";

        default:
            // Fallback path for unknown roles or guests
            return SidebarRoutes.dashboard;
    }
};