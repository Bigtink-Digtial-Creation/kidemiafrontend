import { useState } from "react";
import { addToast, Button, Form, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail } from "react-icons/md";
import { GuardianSignupSchema } from "../../../schema/auth.schema";
import { BiScan, BiUser } from "react-icons/bi";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ApiSDK } from "../../../sdk";
import { AuthRoutes } from "../../../routes";
import { apiErrorParser } from "../../../utils/errorParser";
// Import the specific Guardian schema from your generated SDK
import type { GuardianRegisterRequest } from "../../../sdk/generated";

export default function GuardianSignup() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuardianSignupSchema>({
    resolver: zodResolver(GuardianSignupSchema),
  });

  // --- 1. Mutation using the dedicated Guardian API ---
  const signupMutation = useMutation({
    mutationFn: (payload: GuardianRegisterRequest) =>
      // Calling the specific guardian registration endpoint
      ApiSDK.AuthenticationService.registerGuardianApiV1AuthRegisterGuardianPost(payload),
    onSuccess(data) {
      if (data) {
        addToast({
          title: "Registration Successful",
          description: "Guardian account created. Please login.",
          color: "success",
        });
        navigate(AuthRoutes.login);
      }
    },
    onError(error) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "Registration Error",
        description: parsedError.message,
        color: "danger",
      });
    },
  });

  // --- 2. Clean OnSubmit Logic ---
  const onSubmit = (data: GuardianSignupSchema) => {
    // Only sending what the GuardianRegisterRequest actually needs
    const payload: GuardianRegisterRequest = {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      relationship_type: "parent", // or from a select field if you add one
    };

    signupMutation.mutate(payload);
  };

  return (
    <section className="py-4 w-full md:w-2xl space-y-6">
      <div className="space-y-3">

        <p className="text-lg text-kidemia-black2 text-center font-medium">
          Create your password to complete your registration as a Guardian
        </p>
      </div>

      <div className="py-4 mx-auto">
        <Form className="py-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Input
              label="First Name"
              variant="flat"
              size="lg"
              radius="sm"
              startContent={<BiUser className="text-kidemia-secondary text-xl shrink-0" />}
              placeholder="Enter first name"
              {...register("first_name")}
              isInvalid={!!errors?.first_name}
              errorMessage={errors?.first_name?.message}
            />
            <Input
              label="Last Name"
              variant="flat"
              size="lg"
              radius="sm"
              startContent={<BiUser className="text-kidemia-secondary text-xl shrink-0" />}
              placeholder="Enter last name"
              {...register("last_name")}
              isInvalid={!!errors?.last_name}
              errorMessage={errors?.last_name?.message}
            />
          </div>

          <Input
            label="Email Address"
            variant="flat"
            size="lg"
            radius="sm"
            startContent={<MdOutlineEmail className="text-kidemia-secondary text-xl shrink-0" />}
            placeholder="your@email.com"
            type="email"
            {...register("email")}
            isInvalid={!!errors?.email}
            errorMessage={errors?.email?.message}
          />

          <Input
            label="Password"
            startContent={<BiScan className="text-kidemia-secondary text-xl shrink-0" />}
            endContent={
              <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                {isVisible ? <FaEyeSlash className="text-kidemia-secondary text-xl" /> : <FaRegEye className="text-kidemia-secondary text-xl" />}
              </button>
            }
            placeholder="••••••••"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("password")}
            isInvalid={!!errors?.password}
            errorMessage={errors?.password?.message}
          />

          <Input
            label="Confirm Password"
            startContent={<BiScan className="text-kidemia-secondary text-xl shrink-0" />}
            endContent={
              <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                {isVisible ? <FaEyeSlash className="text-kidemia-secondary text-xl" /> : <FaRegEye className="text-kidemia-secondary text-xl" />}
              </button>
            }
            placeholder="••••••••"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("confirmPassword")}
            isInvalid={!!errors?.confirmPassword}
            errorMessage={errors?.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full mt-4"
            radius="sm"
            isLoading={signupMutation.isPending}
            isDisabled={signupMutation.isPending}
          >
            Complete Registration
          </Button>
        </Form>
      </div>
    </section>
  );
}