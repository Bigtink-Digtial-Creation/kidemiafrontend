import React from "react";
import { Avatar, Image } from "@heroui/react";
import { Link } from "react-router";
import { IoMenu } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { SidebarRoutes } from "../../routes";
import AppLogo from "@/assets/appLogo.png";

type HeaderT = {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (argO: boolean) => void;
};

export default function Header(props: HeaderT) {
  const handleOpenSidebar = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    props.setSidebarOpen(!props.sidebarOpen);
  };

  return (
    <header className="sticky top-0 z-20 flex w-full bg-kidemia-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={handleOpenSidebar}
            className="z-20 block rounded-sm border border-stroke p-1.5 shadow-sm lg:hidden"
          >
            <IoMenu />
          </button>
          <Link to={SidebarRoutes.dashboard} className="flex-shrink-0 hidden">
            <Image src={AppLogo} alt="Logo" width={100} />
          </Link>
        </div>
        <div className="sm:block w-2/5 flex-1 ml-4">
          <h3 className="text-kidemia-black2 text-base font-semibold">
            Hello, Jason
          </h3>
        </div>

        <div>
          <div className="flex items-center space-x-6">
            <FaBell className="text-xl cursor-pointer" />
            <Avatar
              size="sm"
              isBordered
              className="cursor-pointer"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
