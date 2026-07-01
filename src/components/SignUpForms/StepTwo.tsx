import { Button, Form, Image } from "@heroui/react";
import { useForm } from "react-hook-form";
import { StepTwoSchema } from "../../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useSetAtom } from "jotai";
import { signupFormData, signupInfoStep } from "../../store/auth.atom";
import Student from "@/assets/images/general/student-icon.svg";

export default function StepTwo() {
    const setStep = useSetAtom(signupInfoStep);
    const [formData, setFormData] = useAtom(signupFormData);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StepTwoSchema>({
        resolver: zodResolver(StepTwoSchema),
        defaultValues: {
            // Defaults to student so the form is pre-validated since it's the only option
            role: formData.stepTwo.role || "student",
        },
    });

    const onSubmit = (data: StepTwoSchema) => {
        setFormData((prev) => ({
            ...prev,
            stepTwo: data,
        }));
        setStep("STEPTHREE");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl text-kidemia-black font-semibold text-center">
                Are you a
            </h2>

            <div className="py-4 w-full">
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-full space-y-6"
                >
                    {/* Changed grid-cols-2 to grid-cols-1 with a max-width wrapper so the single card stays perfectly centered */}
                    <div className="grid grid-cols-1 max-w-xs mx-auto gap-12 w-full">
                        <div>
                            <input
                                {...register("role")}
                                type="radio"
                                value="student"
                                id="student"
                                className="sr-only peer"
                            />
                            <label
                                htmlFor="student"
                                className="flex flex-col items-center py-10 px-6 space-y-5 border-2 border-kidemia-grey/20 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-kidemia-secondary/50 peer-checked:bg-kidemia-biege peer-checked:shadow-lg hover:border-kidemia-secondary hover:shadow-md"
                            >
                                <div className="flex items-center justify-center w-26 h-26">
                                    <Image src={Student} />
                                </div>
                                <h3 className="text-xl font-semibold text-kidemia-black">
                                    Student
                                </h3>
                            </label>
                        </div>

                        {/* Commented out the School option. 
                To restore in the future:
                1. Change the grid container wrapper above back to: "grid grid-cols-2 gap-12 w-full"
                2. Delete these surrounding block comment tags
            
            <div>
              <input
                {...register("role")}
                type="radio"
                value="institution_admin"
                id="school"
                className="sr-only peer"
              />
              <label
                htmlFor="school"
                className="flex flex-col items-center py-10 px-6 space-y-5 border-2 border-kidemia-grey/20 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-kidemia-secondary/50 peer-checked:bg-kidemia-biege peer-checked:shadow-lg hover:border-kidemia-secondary hover:shadow-md"
              >
                <div className="flex items-center justify-center w-26 h-26">
                  <Image src={School} />
                </div>
                <h3 className="text-xl font-semibold text-kidemia-black">
                  School
                </h3>
              </label>
            </div>
            */}
                    </div>

                    {errors.role && (
                        <p className="text-red-500 text-sm pt-2">{errors.role?.message}</p>
                    )}

                    <div className="w-full flex justify-between items-center pt-8 space-x-8">
                        <Button
                            className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
                            variant="faded"
                            size="md"
                            radius="sm"
                            type="button"
                            onPress={() => setStep("STEPONE")}
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