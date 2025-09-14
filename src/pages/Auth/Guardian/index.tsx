import { useState } from "react";
import { Button, Form, Image, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail } from "react-icons/md";
import { GuardianSignupSchema } from "../../../schema/auth.schema";
import Logo from "@/assets/kidemia.svg";
import { BiScan } from "react-icons/bi";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

export default function GuardianSignup() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuardianSignupSchema>({
    resolver: zodResolver(GuardianSignupSchema),
  });

  const onSubmit = (data: GuardianSignupSchema) => {
    console.log(data);
  };

  return (
    <section className="py-4 w-full md:w-2xl space-y-6">
      <div className="space-y-3">
        <div className="flex justify-center items-center space-x-5">
          <h2 className="text-3xl text-kidemia-black font-semibold text-center">
            Welcome to
          </h2>
          <Image src={Logo} alt="logo" />
        </div>
        <p className="text-lg text-kidemia-black2 text-center font-medium">
          Create your passward to complete your registration as a Guardian
        </p>
      </div>

      <div className="py-4 mx-auto">
        <Form className="py-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
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
      </div>
    </section>
  );
}
