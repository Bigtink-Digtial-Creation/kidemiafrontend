import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { addToast, Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdOutlineEmail } from "react-icons/md";
import { signupFormData, signupInfoStep } from "../../store/auth.atom";
import { StepFourSchema } from "../../schema/auth.schema";
import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest, UserType } from "../../sdk/generated";
import { ApiSDK } from "../../sdk";
import { useNavigate } from "react-router";
import { AuthRoutes } from "../../routes";
import { apiErrorParser } from "../../utils/errorParser";

export default function StepFour() {
  const setStep = useSetAtom(signupInfoStep);
  const [formData, setFormData] = useAtom(signupFormData);
  const role = useAtomValue(signupFormData).stepTwo?.role || "";
  const finalFormData = useAtomValue(signupFormData);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepFourSchema>({
    resolver: zodResolver(StepFourSchema),
    defaultValues: {
      guardianOrAdminEmail: formData.stepFour.guardianOrAdminEmail || "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: (formData: RegisterRequest) =>
      ApiSDK.AuthenticationService.registerApiV1AuthRegisterPost(formData),
    onSuccess(data) {
      if (data) {
        navigate(AuthRoutes.login);
        addToast({
          title: data?.message,
          color: "success",
        });
      }
    },
    onError(error) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
      });
    },
  });

  const onSubmit = (data: StepFourSchema) => {
    console.log({ finalFormData });
    console.log(data);

    setFormData((prev) => ({
      ...prev,
      stepFour: data,
    }));

    const updatedFormData = {
      ...finalFormData,
      stepFour: data,
    };

    const {
      stepOne: { email, password, first_name, last_name },
      stepTwo: { role },
    } = updatedFormData;

    const payload = {
      email,
      password,
      first_name,
      last_name,
      user_type: role as UserType,
    };

    signupMutation.mutate(payload);
  };

  const heading =
    role === "student" ? "Let's meet your guardian" : "Secondary Admin";
  const subText =
    role === "student"
      ? "Your guardian would receive reports on tests and exams you take"
      : "This admin would receive report from the school";

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl text-kidemia-black font-semibold text-center">
          {heading}
        </h2>
        <p className="text-lg text-kidemia-black2 text-center font-medium">
          {subText}
        </p>
      </div>

      <div>
        <Form
          className="py-4 space-y-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {role === "student" ? (
            <div className="pb-2 w-full">
              <Input
                variant="flat"
                size="lg"
                radius="sm"
                startContent={
                  <MdOutlineEmail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                }
                placeholder="Guardian email"
                type="email"
                {...register("guardianOrAdminEmail")}
                isInvalid={!!errors?.guardianOrAdminEmail?.message}
                errorMessage={errors?.guardianOrAdminEmail?.message}
                isDisabled={signupMutation.isPending}
              />
            </div>
          ) : (
            <div className="pb-2 w-full">
              <Input
                variant="flat"
                size="lg"
                radius="sm"
                startContent={
                  <MdOutlineEmail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                }
                placeholder="Secondary email"
                type="email"
                {...register("guardianOrAdminEmail")}
                isInvalid={!!errors?.guardianOrAdminEmail?.message}
                errorMessage={errors?.guardianOrAdminEmail?.message}
                isDisabled={signupMutation.isPending}
              />
            </div>
          )}

          <div className="w-full flex justify-between items-center pt-12  space-x-8">
            <Button
              className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
              variant="faded"
              size="md"
              radius="sm"
              type="button"
              onPress={() => setStep("STEPTHREE")}
              isDisabled={signupMutation.isPending}
            >
              Back
            </Button>
            <Button
              className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
              size="md"
              radius="sm"
              type="submit"
              isDisabled={signupMutation.isPending}
              isLoading={signupMutation.isPending}
            >
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
