import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SpinnerCircle from "../components/Spinner/Circle";
import { loggedinUserAtom, storedAuthTokenAtom } from "../store/user.atom";
import { useAtomValue } from "jotai";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // useAuthRedirect should handle verifying the session
  // const { loggedInUser, authToken } = useAuthRedirect(true);
  const loggedInUser = useAtomValue(loggedinUserAtom);
  const authToken = useAtomValue(storedAuthTokenAtom)


  if (!loggedInUser || !authToken) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SpinnerCircle />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg">
      <Sidebar
        sidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header
          sidebarOpen={isSidebarOpen}
          setSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-grow">
          <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 2xl:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}