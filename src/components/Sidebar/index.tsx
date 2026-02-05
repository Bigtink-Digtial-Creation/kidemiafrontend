import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Image,
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { PaymentRoutes, SidebarRoutes, GuardianRoutes } from "../../routes";
import { FiBarChart2, FiLogOut, FiSettings, FiZap } from "react-icons/fi";
import { sidebarLinks } from "./sidebarLink.ts";
import SidebarLink from "./SidebarLink.tsx";
import { AppDarkLogo } from "../../assets/images";
import LogoutModal from "./LogoutModal";
import { useActiveSubscription } from "../../hooks/useActiveSubscription.ts";
import { useAtomValue } from "jotai";
import { loggedinUserAtom, userRoleAtom } from "../../store/user.atom";
import type { UserRole } from "../../utils/enums.ts";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const userRole = useAtomValue(userRoleAtom);
  const { currentPlanCode } = useActiveSubscription();

  const formattedPlanCode = currentPlanCode
    ? currentPlanCode.toLowerCase().replace(/\s+/g, "-")
    : "No Active Plan";

  const [focused, setFocused] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logout = useDisclosure();
  const loggedInUser = useAtomValue(loggedinUserAtom);
  const studentId = loggedInUser?.user?.student?.id;
  const closeSidebar = useCallback(
    () => setSidebarOpen(false),
    [setSidebarOpen],
  );

  useEffect(() => {
    const clickOutsideHandler = ({ target }: MouseEvent) => {
      if (
        sidebarOpen &&
        !sidebarRef.current?.contains(target as Node) &&
        !backdropRef.current?.contains(target as Node)
      ) {
        closeSidebar();
      }
    };

    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (sidebarOpen && keyCode === 27) {
        closeSidebar();
      }
    };

    document.addEventListener("click", clickOutsideHandler);
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("click", clickOutsideHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [sidebarOpen, closeSidebar]);

  // Determine Logo Redirect Path
  const logoPath = userRole === "guardian" ? GuardianRoutes.dashboard : SidebarRoutes.dashboard;
  const isStudent = userRole === "student";
  return (
    <>
      {sidebarOpen && (
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40"
          onClick={() => closeSidebar()}
        ></div>
      )}
      <aside
        ref={sidebarRef}
        className={`w-2xs absolute left-0 top-0 z-50 flex flex-col items-start justify-start overflow-y-clip bg-[#f5f6fa]/30 shadow-md transition-transform duration-300 ease-linear dark:bg-dark lg:static lg:translate-x-0 h-screen ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="w-full flex justify-start">
          <div className="w-full flex items-center justify-between px-6 py-4">
            <NavLink
              to={logoPath}
              className="animate-sidebar-text-show"
            >
              <Image src={AppDarkLogo} alt="Logo" width={80} />
            </NavLink>
          </div>
        </div>

        <div className="w-full flex flex-col overflow-y-auto duration-300 ease-linear h-full">
          <ScrollShadow hideScrollBar={true} as={"nav"} className="py-2 px-4 flex-grow">
            <div
              className="overflow-x-hidden w-full"
              onMouseLeave={() => setFocused("")}
            >
              <ul className="flex flex-col gap-3 lg:gap-1">
                {sidebarLinks
                  .filter((link) => link.allowedRoles?.includes(userRole as UserRole) || "")
                  .map((link) => (
                    <li
                      key={link.pathname}
                      onMouseEnter={() => setFocused(link.title)}
                      className="group relative"
                    >
                      <SidebarLink
                        pathname={link.pathname}
                        title={link.title}
                        icon={link.icon}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={closeSidebar}
                      />
                      {focused === link.title ? (
                        <motion.div
                          transition={{
                            layout: { duration: 0.2, ease: "easeOut" },
                          }}
                          className="absolute bottom-0 left-0 right-0 w-full h-full group-hover:text-dark px-5 pr-8 m-0 z-0 rounded-lg space-x-0"
                          layoutId="highlight"
                        />
                      ) : null}
                    </li>
                  ))}
              </ul>
            </div>
          </ScrollShadow>
          <Divider />

          <div className="w-full p-4 space-y-4">
            <ul className="flex flex-col gap-1 mb-2 space-y-2">

              {isStudent && (
                <li className="group">
                  <SidebarLink
                    pathname={SidebarRoutes.analytics.replace(":studentId", studentId!)}
                    title="Report Card"
                    icon={FiBarChart2}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={closeSidebar}
                  />
                </li>
              )}

              <li className="group">
                <SidebarLink
                  pathname={
                    userRole === "guardian"
                      ? GuardianRoutes.subscription
                      : PaymentRoutes.subscriptionUpgrade
                  }
                  title={userRole === "guardian" ? "Manage Plan" : "Upgrade Plan"}
                  subText={formattedPlanCode}
                  icon={FiZap}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={closeSidebar}
                />
              </li>

              <li className="group">
                <SidebarLink
                  pathname={userRole === "guardian" ? GuardianRoutes.settings : SidebarRoutes.settings}
                  title="Settings"
                  icon={FiSettings}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={closeSidebar}
                />
              </li>

              <li className="group">
                <Button
                  aria-label="Logout"
                  startContent={<FiLogOut className="text-xl" />}
                  className="group text-base bg-transparent text-kidemia-black2 hover:bg-kidemia-primary hover:text-kidemia-white w-full animate-sidebar-text-show rounded-md py-2 px-4 transition-transform justify-start"
                  onPress={() => logout.onOpen()}
                >
                  Log Out
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={logout.isOpen}
        onOpenChange={logout.onOpenChange}
        onClose={logout.onClose}
      />
    </>
  );
}