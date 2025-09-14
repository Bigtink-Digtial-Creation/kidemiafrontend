import { FaCheck } from "react-icons/fa";

type StepperT = {
  title: string;
  step: string;
  activeStep: string;
  isLast?: boolean;
  completedSteps?: string[];
};

export default function Stepper(props: StepperT) {
  const isActive = props.step === props.activeStep;
  const isCompleted = props.completedSteps?.includes(props.step);

  return (
    <div className="flex items-center">
      <div
        className={`rounded-full p-2 text-kidemia-white font-semibold flex justify-center items-center h-9 w-9 
          ${
            isCompleted
              ? "bg-kidemia-success"
              : isActive
                ? "bg-kidemia-secondary"
                : "bg-kidemia-grey/20"
          }`}
      >
        {isCompleted ? <FaCheck className="text-kidemia-white" /> : props.title}
      </div>
      {!props.isLast && (
        <span className="flex-1 items-center justify-center border-b-2 border-dashed border-kidemia-grey/40 mx-2 md:mx-4 w-12 md:w-36 h-2"></span>
      )}
    </div>
  );
}
