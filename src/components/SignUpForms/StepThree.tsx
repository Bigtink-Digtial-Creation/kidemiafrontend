import { useState } from "react";
import { useForm } from "react-hook-form";
import { StepThreeSchema } from "../../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { signupFormData, signupInfoStep } from "../../store/auth.atom";
import { Button, Form, Input, Radio, RadioGroup } from "@heroui/react";
import { IoSchoolSharp } from "react-icons/io5";

const prepData = [
  { title: "Common Entrance", value: "CE" },
  { title: "Junior WAEC", value: "JW" },
  { title: "Senior WAEC", value: "SW" },
];

export default function StepThree() {
  const [formData, setFormData] = useAtom(signupFormData);
  const [selectedExam, setSelectedExam] = useState<string>(
    formData?.stepThree?.examOrSchool || "",
  );
  const setStep = useSetAtom(signupInfoStep);
  const role = useAtomValue(signupFormData).stepTwo?.role;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StepThreeSchema>({
    resolver: zodResolver(StepThreeSchema),
    defaultValues: {
      examOrSchool: formData.stepThree.examOrSchool || "",
    },
  });

  const onSubmit = (data: StepThreeSchema) => {
    console.log(data);
    setFormData((prev) => ({
      ...prev,
      stepThree: data,
    }));
    setStep("STEPFOUR");
  };

  const heading =
    role === "student" ? "What are you preparing for?" : "Your school name";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-kidemia-black font-semibold text-center">
        {heading}
      </h2>

      <div>
        <Form
          className="py-4 space-y-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {role === "student" ? (
            <div className="flex  flex-col justify-center items-center w-full">
              <RadioGroup
                orientation="horizontal"
                color="default"
                className="gap-4"
                value={selectedExam}
                onValueChange={(val) => {
                  setSelectedExam(val);
                  setValue("examOrSchool", val);
                }}
              >
                {prepData.map((prep) => (
                  <Radio key={prep.value} value={prep.value}>
                    {prep.title}
                  </Radio>
                ))}
              </RadioGroup>

              {errors.examOrSchool && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.examOrSchool.message}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full">
              <Input
                variant="flat"
                size="lg"
                radius="sm"
                type="text"
                placeholder="Enter your school name"
                {...register("examOrSchool")}
                startContent={
                  <IoSchoolSharp className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                }
                isInvalid={!!errors?.examOrSchool?.message}
                errorMessage={errors?.examOrSchool?.message}
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
              onPress={() => setStep("STEPTWO")}
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
