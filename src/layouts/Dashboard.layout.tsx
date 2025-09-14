import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <div>
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            sidebarOpen={isSidebarOpen}
            setSidebarOpen={setIsSidebarOpen}
          />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header
              sidebarOpen={isSidebarOpen}
              setSidebarOpen={setIsSidebarOpen}
            />
            <main>
              <div className="mx-auto max-w-screen-2xl px-3 py-4">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
