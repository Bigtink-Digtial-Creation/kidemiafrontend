import { NavLink } from "react-router";
import type { SidebarLinkT } from "./sidebarLink";

type SidebarPropsT = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
};

export default function SidebarLink(
  props: SidebarPropsT & Omit<SidebarLinkT, "allowedRoles">,
) {
  const Icon = props.icon;

  const closeSidebar = () => {
    if (props.sidebarOpen) {
      props.setSidebarOpen(false);
    }
  };

  return (
    <NavLink
      to={props.pathname}
      end
      onClick={closeSidebar}
      className={({ isActive }) =>
        `z-10 group relative flex w-full items-center gap-2 rounded-md py-2 px-4 font-medium transition-all
        ${isActive
          ? "bg-kidemia-primary text-kidemia-white"
          : "text-kidemia-black2 hover:bg-kidemia-primary hover:text-kidemia-white"
        }`
      }
    >
      {Icon && (
        <Icon className="text-xl shrink-0" />
      )}

      <div className="flex flex-col leading-tight">
        <span className="font-medium text-base animate-sidebar-text-show">
          {props.title}
        </span>

        {props.subText && (
          <span className="text-xs opacity-80">
            {props.subText}
          </span>
        )}
      </div>
    </NavLink>
  );
}
