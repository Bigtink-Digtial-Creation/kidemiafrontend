import { Card, CardBody } from "@heroui/react";

interface InstructionCardI {
  title: string;
  code: string;
  exam_session: string;
  exam_year: string;
  assessment_type: string;
  category: string;
  description: string;
  instructions: string;
}

export default function InstructionCard(props: InstructionCardI) {
  return (
    <div>
      <div>
        <Card
          shadow="none"
          className="border border-kidemia-grey/20 bg-kidemia-white"
        >
          <CardBody className="p-6">
            <div className="flex- items-center- justify-between- space-y-1 ">
              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Title:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {props.title || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Code:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {props.code || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Session:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {props.exam_session || "---"}, {props.exam_year || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Assessment Type:
                </p>
                <p className="text-kidemia-black text-sm font-medium capitalize text-center">
                  {props.assessment_type || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Category:
                </p>
                <p className="text-kidemia-black text-sm font-medium capitalize">
                  {props.category || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Description:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {props.description || "---"}
                </p>
              </div>

              <div className="py-4">
                <p className="text-kidemia-black text-sm font-medium leading-relaxed whitespace-pre-line">
                  {props.instructions || "No specific instructions provided."}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
