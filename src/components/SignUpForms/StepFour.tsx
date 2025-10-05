import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdOutlineEmail } from "react-icons/md";
import { signupFormData, signupInfoStep } from "../../store/auth.atom";
import { StepFourSchema } from "../../schema/auth.schema";
import { loggedinUserAtom, storedAuthTokenAtom } from "../../store/user.atom";

export default function StepFour() {
  const setStep = useSetAtom(signupInfoStep);
  const [formData, setFormData] = useAtom(signupFormData);
  const role = useAtomValue(signupFormData).stepTwo?.role || "";
  const finalFormData = useAtomValue(signupFormData)
  const setStoredToken = useSetAtom(storedAuthTokenAtom)
  const setLoggedInUser = useSetAtom(loggedinUserAtom)



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

  const onSubmit = (data: StepFourSchema) => {
    console.log({ finalFormData });
    console.log(data);

    setFormData((prev) => ({
      ...prev,
      stepFour: data,
    }));
    //navigate to next step
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
            >
              Back
            </Button>
            <Button
              className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
              size="md"
              radius="sm"
              type="submit"
            >
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
