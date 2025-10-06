import { Outlet, useNavigate } from "react-router";
import { Button, Image, Spinner } from "@heroui/react";
import { MdArrowBackIosNew } from "react-icons/md";
import { useAuthRedirect } from "../hooks/use-auth-redirect";

export default function TestLayout() {
  const navigate = useNavigate();
  const { loggedInUser, authToken } = useAuthRedirect(true)


  if (!loggedInUser || !authToken) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-kidemia-biege space-y-6 px-6">
      <div className="absolute top-2 left-0 px-4">
        <Button
          variant="light"
          className="bg-kidemia-biege text-kidemia-secondary font-semibold"
          startContent={<MdArrowBackIosNew className="text-sm" />}
          type="button"
          onPress={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>

      <div className="min-h-screen py-4 flex flex-col justify-center items-center w-full max-w-8xl mx-auto overflow-y-hidden">
        <div className="flex justify-center">
          <Image src="../src/assets/appLogo.png" alt="logo" width={150} />
        </div>
        <Outlet />
      </div>
    </section>
  );
}
