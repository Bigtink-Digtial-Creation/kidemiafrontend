import "swiper/css";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Image as HeroImage,
  useDisclosure,
} from "@heroui/react";
import { Link, useLocation } from "react-router";
import { IoMdMenu } from "react-icons/io";
import { AppLogo, AppDarkLogo } from "../../assets/images";
import { AuthRoutes, HomeRoutes } from "../../routes";

export default function NavBar() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const location = useLocation();

  const navLinks = [
    { to: HomeRoutes.subjects, label: "Features" },
    { to: HomeRoutes.test, label: "Community" },
    { to: HomeRoutes.about, label: "About" },
  ];

  const isActive = (path: string) =>
    location?.pathname === path
      ? "text-white font-bold"
      : "text-white/90 font-medium";

  return (
    <nav className="fixed z-50 top-0 left-0 right-0 py-4 px-4 md:px-16 bg-kidemia-secondary w-full shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={AppLogo} alt="logo" className="w-20 h-auto" />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm ${isActive(link.to)} hover:text-white transition`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to={AuthRoutes.signup}>
              <Button
                className="bg-transparent font-semibold text-white
                                 hover:bg-white hover:text-kidemia-primary shadow-sm px-4 py-2"
                variant="bordered"
                size="sm"
                radius="sm"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <Button
          isIconOnly
          variant="light"
          className="md:hidden p-2 text-white"
          onPress={onOpen}
        >
          <IoMdMenu size={24} />
        </Button>

        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="left"
          size="xs"
          className="rounded-none"
        >
          <DrawerContent>
            <DrawerHeader className="pt-6 pb-2">
              <div className="flex items-center justify-between">
                <HeroImage src={AppDarkLogo} alt="logo" width={80} />
              </div>
            </DrawerHeader>

            <DrawerBody>
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm hover:underline hover:text-kidemia-primary `}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex flex-col space-y-4 pt-6">
                  <Link to={AuthRoutes.signup} onClick={onClose}>
                    <Button
                      className="bg-kidemia-biege border border-enita-black2 font-bold text-kidemia-primary w-full"
                      variant="faded"
                      size="sm"
                      radius="sm"
                      type="button"
                    >
                      Sign Up
                    </Button>
                  </Link>
                  <Link to={AuthRoutes.login} onClick={onClose}>
                    <Button
                      className="bg-kidemia-secondary text-kidemia-white font-bold w-full"
                      size="sm"
                      radius="sm"
                      type="submit"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
