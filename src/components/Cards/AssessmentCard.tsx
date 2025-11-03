import { Button, Card, CardBody, CardFooter } from "@heroui/react";
import { FaArrowRight, FaRegQuestionCircle } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";
import { MdCreditScore } from "react-icons/md";

interface AssessmentCardI {
  title: string;
  code: string;
  timeMins: number;
  questionsNo: number;
  attemptsNo: number;
  priceNo: string;
  avgScore: string
}
export default function AssessmentCard({
  title,
  code,
  timeMins,
  questionsNo,
  attemptsNo,
  priceNo,
  avgScore
}: AssessmentCardI) {
  return (
    <Card shadow="none" className="p-4 bg-kidemia-biege/25 border border-kidemia-grey/30">
      <CardBody>

        <div className="space-y-2">
          <h3 className="text-kidemia-black font-medium text-base">{title}</h3>
          <p className="text-sm text-kidemia-grey">{code}</p>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-2 py-4">
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

          <div className="flex items-center space-x-1">
            <MdCreditScore className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            <p className="text-kidemia-grey text-md">{avgScore} average score</p>
          </div>
        </div>

      </CardBody>

      <CardFooter className="flex justify-between items-center gap-2">
        <p className="text-kidemia-grey text-md whitespace-nowrap">{priceNo} Units</p>

        <Button
          className="bg-kidemia-secondary text-kidemia-white font-medium"
          size="md"
          radius="sm"
          type="button"

          endContent={<FaArrowRight />}
        >
          Practice
        </Button>
      </CardFooter>

    </Card>
  );
}
