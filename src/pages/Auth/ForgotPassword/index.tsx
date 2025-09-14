import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail } from "react-icons/md";
import { ForgotPasswordSchema } from "../../../schema/auth.schema";
import { AuthRoutes } from "../../../routes";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    console.log(data);
  };

  return (
    <div className="py-4 w-full md:w-2xl space-y-6 md:px-12">
      <div className="space-y-3">
        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
          Forgot Password
        </h2>
        <p className="text-lg text-kidemia-black2 text-center font-medium">
          Enter your email to receive you reset link
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

        <div className="py-4 w-full">
          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
            radius="sm"
          >
            Continue
          </Button>
        </div>
      </Form>

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
