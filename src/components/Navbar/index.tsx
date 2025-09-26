import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Image,
  useDisclosure,
} from "@heroui/react";
import { Link, useLocation } from "react-router";
import { AuthRoutes, HomeRoutes } from "../../routes";
import { IoMdMenu } from "react-icons/io";

export default function NavBar() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const location = useLocation();

  const navLinks = [
    { to: HomeRoutes.home, label: "Home" },
    { to: HomeRoutes.test, label: "Test" },
    { to: HomeRoutes.subjects, label: "Subjects" },
    { to: HomeRoutes.about, label: "About Us" },
    { to: HomeRoutes.contact, label: "Contact Us" },
  ];

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-kidemia-primary font-bold"
      : "text-kidemia-black font-medium";

  return (
    <nav className="py-3 px-4 md:px-16 bg-white w-full shadow-sm flex justify-between items-center">
      <div>
        <Image src="../src/assets/appLogo.png" alt="logo" width={80} />
      </div>

      <div className="hidden md:flex items-center justify-between space-x-7">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm  ${isActive(link.to)} hover:underline hover:text-kidemia-primary`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex space-x-6">
        <Link to={AuthRoutes.login}>
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
        <Link to={AuthRoutes.signup}>
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

      {/* Mobile Menu Icon */}
      <Button
        isIconOnly
        variant="light"
        className="md:hidden p-2 text-kidemia-primary"
        onPress={onOpen}
      >
        <IoMdMenu size={24} />
      </Button>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        size="xs"
        className="p-6- rounded-none"
      >
        <DrawerContent>
          <DrawerHeader className="flex- flex-col- gap-1-">
            <div>
              <Image src="../src/assets/appLogo.png" alt="logo" width={80} />
            </div>
          </DrawerHeader>

          <DrawerBody>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm hover:underline hover:text-kidemia-primary ${isActive(link.to)}`}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col space-y-4 pt-6">
                <Link to={AuthRoutes.login} onClick={onClose}>
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
                <Link to={AuthRoutes.signup} onClick={onClose}>
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
    </nav>
  );
}
