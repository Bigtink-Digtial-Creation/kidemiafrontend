import { useState } from "react";
import { useForm } from "react-hook-form";
import { StepOneSchema } from "../../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useSetAtom } from "jotai";
import { signupFormData, signupInfoStep } from "../../store/auth.atom";
import { Button, Form, Input } from "@heroui/react";
import { MdOutlineEmail } from "react-icons/md";
import { BiScan, BiUser } from "react-icons/bi";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthRoutes } from "../../routes";
import { Link } from "react-router";

export default function StepOne() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const setStep = useSetAtom(signupInfoStep);
  const [formData, setFormData] = useAtom(signupFormData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepOneSchema>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      email: formData.stepOne.email,
      password: formData.stepOne.password,
      confirmPassword: formData.stepOne.confirmPassword,
    },
  });

  const onSubmit = (data: StepOneSchema) => {
    setFormData((prev) => ({
      ...prev,
      stepOne: data,
    }));
    setStep("STEPTWO");
  };

  return (
    <div className="space-y-4">
      <Form className="py-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-2 w-full flex items-center gap-4">
          <Input
            variant="flat"
            size="lg"
            radius="sm"
            startContent={
              <BiUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            placeholder="Your Firstname"
            type="text"
            {...register("first_name")}
            isInvalid={!!errors?.first_name?.message}
            errorMessage={errors?.first_name?.message}
          />
          <Input
            variant="flat"
            size="lg"
            radius="sm"
            startContent={
              <BiUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            placeholder="Your Lastname"
            type="text"
            {...register("last_name")}
            isInvalid={!!errors?.last_name?.message}
            errorMessage={errors?.last_name?.message}
          />
        </div>
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
            placeholder="New Password"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("password")}
            isInvalid={!!errors?.password?.message}
            errorMessage={errors?.password?.message}
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
            placeholder="Confirm Password"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("confirmPassword")}
            isInvalid={!!errors?.confirmPassword?.message}
            errorMessage={errors?.confirmPassword?.message}
          />
        </div>

        <div className="py-4 w-full">
          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
            radius="sm"
          >
            Sign Up
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

      <div className="w-full flex justify-between items-center">
        <p className="text-base text-kidemia-black font-medium text-center">
          I have an account{" "}
          <Link
            to={AuthRoutes.login}
            className="text-kidemia-secondary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="text-base text-kidemia-black font-medium text-center">
          Sign up as a{" "}
          <Link
            to={AuthRoutes.guardian}
            className="text-kidemia-secondary font-semibold hover:underline"
          >
            Guardian
          </Link>
        </p>
      </div>
    </div>
  );
}
