import { Outlet } from "react-router";
import { Image, Spinner } from "@heroui/react";
import { useAuthRedirect } from "../hooks/use-auth-redirect";

export default function TestLayout() {
  const { loggedInUser, authToken } = useAuthRedirect(true);

  if (!loggedInUser || !authToken) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-kidemia-biege/50 space-y-6 px-3 md:px-6">
      <div className="min-h-screen py-4 flex flex-col justify-center items-center w-full max-w-8xl mx-auto overflow-y-hidden">
        <div className="flex justify-center">
          <Image src="../src/assets/appLogo.png" alt="logo" width={150} />
        </div>
        <Outlet />
      </div>
    </section>
  );
}
