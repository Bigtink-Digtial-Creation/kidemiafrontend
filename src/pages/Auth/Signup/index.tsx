import type { JSX } from "react";
import { useAtom } from "jotai";
import { Image } from "@heroui/react";
import { signupInfoStep, type SignUpInfoT } from "../../../store/auth.atom";
import Stepper from "../../../components/SignUpForms/Stepper";
import StepOne from "../../../components/SignUpForms/StepOne";
import StepTwo from "../../../components/SignUpForms/StepTwo";
import StepThree from "../../../components/SignUpForms/StepThree";
import StepFour from "../../../components/SignUpForms/StepFour";
import Logo from "@/assets/kidemia.svg";

type StepTabT = {
  title: string;
  step: SignUpInfoT;
};

const stepList: StepTabT[] = [
  { title: "1", step: "STEPONE" },
  { title: "2", step: "STEPTWO" },
  { title: "3", step: "STEPTHREE" },
  { title: "4", step: "STEPFOUR" },
];

const RenderStep: Record<SignUpInfoT, JSX.Element | null> = {
  STEPONE: <StepOne />,
  STEPTWO: <StepTwo />,
  STEPTHREE: <StepThree />,
  STEPFOUR: <StepFour />,
};

export default function SignUpPage() {
  const [currentStep] = useAtom(signupInfoStep);

  const currentIndex = stepList.findIndex((s) => s.step === currentStep);
  const completedSteps = stepList.slice(0, currentIndex).map((s) => s.step);

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
          Complete your registration in just 4 steps
        </p>
      </div>

      <div className="w-full md:w-2xl  flex justify-between items-center">
        {stepList.map((step, index) => (
          <Stepper
            key={step.step}
            title={step.title}
            step={step.step}
            activeStep={currentStep}
            completedSteps={completedSteps}
            isLast={index === stepList.length - 1}
          />
        ))}
      </div>

      <div className="py-4 mx-auto">{RenderStep[currentStep]}</div>
    </section>
  );
}
