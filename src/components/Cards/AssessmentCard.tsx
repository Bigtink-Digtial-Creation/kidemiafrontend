import { Button } from "@heroui/react";
import { FaArrowRight, FaRegQuestionCircle } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";

interface AssessmentCardI {
  title: string;
  code: string;
  timeMins: string;
  questionsNo: string;
  attemptsNo: string;
  priceNo: string;
}
export default function AssessmentCard({
  title,
  code,
  timeMins,
  questionsNo,
  attemptsNo,
  priceNo,
}: AssessmentCardI) {
  return (
    <div className="px-4 py-6  bg-kidemia-biege/25 border border-kidemia-grey/30 rounded-2xl space-y-4">
      <div className="space-y-2">
        <h3 className="text-kidemia-black font-semibold text-base">{title}</h3>
        <p className="text-sm text-kidemia-grey">{code}</p>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-1">
          <IoTimeOutline className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
          <p className="text-kidemia-grey text-md">{timeMins} mins</p>
        </div>

        <div className="flex items-center space-x-1">
          <FaRegQuestionCircle className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
          <p className="text-kidemia-grey text-md">{questionsNo} questions</p>
        </div>

        <div className="flex items-center space-x-1">
          <FaRegCircleCheck className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
          <p className="text-kidemia-grey text-md">{attemptsNo} attempts</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-kidemia-grey text-md">{priceNo} Units</p>

        <Button
          className="bg-kidemia-secondary text-kidemia-white font-medium"
          size="md"
          radius="sm"
          type="button"
          endContent={<FaArrowRight />}
          // onPress={handleNext}
          // isDisabled={!selectedAnswers[currentIndex]}
        >
          Practice
        </Button>
      </div>
    </div>
  );
}
