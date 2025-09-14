import { Image } from "@heroui/react";
import { Link } from "react-router";
import { AuthRoutes } from "../../routes";

export default function NavBar() {
  return (
    <nav className="py-4 px-4 md:px-8 bg-kidemia-grey text-white w-full shadow-sm flex justify-between items-center">
      <div>
        <Image src="../src/assets/appLogo.png" alt="logo" width={80} />
      </div>

      <div className="flex space-x-6">
        <Link to={AuthRoutes.login}>Login</Link>
        <Link to={AuthRoutes.signup}>Signup</Link>
      </div>
    </nav>
  );
}
