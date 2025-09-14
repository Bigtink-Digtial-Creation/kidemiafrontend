import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../../schema/auth.schema";
import { MdOutlineEmail } from "react-icons/md";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { BiScan } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { AuthRoutes, SidebarRoutes } from "../../../routes";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    console.log(data);
    navigate(SidebarRoutes.dashboard);
  };

  return (
    <div className="py-4 w-full md:w-2xl space-y-6 md:px-12">
      <div className="space-y-3">
        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
          Welcome Back
        </h2>
        <p className="text-lg text-kidemia-black2 text-center font-medium">
          Login to continue
        </p>
      </div>

      <Form className="py-6 space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-2 w-full">
          <Input
            variant="flat"
            size="lg"
            radius="sm"
            startContent={
              <MdOutlineEmail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            placeholder="Your email"
            type="email"
            {...register("email")}
            isInvalid={!!errors?.email?.message}
            errorMessage={errors?.email?.message}
          />
        </div>

        <div className="pb-2 w-full space-y-2">
          <Input
            startContent={
              <BiScan className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaEyeSlash className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                ) : (
                  <FaRegEye className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                )}
              </button>
            }
            placeholder="Password"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("password")}
            isInvalid={!!errors?.password?.message}
            errorMessage={errors?.password?.message}
          />

          <div>
            <Link
              to={AuthRoutes.forgotPassword}
              className="text-kidemia-secondary text-sm font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="py-4 w-full">
          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
            radius="sm"
          >
            Login
          </Button>
        </div>
      </Form>

      <div className="flex justify-center items-center">
        <span className="text-kidemia-black text-base font-semibold">OR</span>
      </div>

      <div className="w-full">
        <Button
          size="lg"
          radius="sm"
          className="bg-kidemia-white text-kidemia-black font-semibold w-full"
          startContent={<FcGoogle className="text-xl" />}
        >
          Continue with Google
        </Button>
      </div>

      <div className="w-full">
        <p className="text-base text-kidemia-black font-medium text-center">
          I don't have an account{" "}
          <Link
            to={AuthRoutes.signup}
            className="text-kidemia-secondary font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
