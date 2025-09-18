import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
} from "@heroui/react";

interface ModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string | null;
}

export default function PerformanceModal({ isOpen, onOpenChange, id }: ModalI) {
  // dummy text
  const expandedData = {
    dateCreated: "2025-09-01",
    averageScore: 78,
    totalQuestion: 100,
    attemptedQuestion: 70,
    timeUsed: "1hr",
    status: "completed",
    comment:
      "Overall strong performance, but needs improvement in problem-solving speed. Overall strong performance, but needs improvement in problem-solving speed.",
    sections: [
      { name: "Algebra", score: 85 },
      { name: "Geometry", score: 72 },
      { name: "Statistics", score: 80 },
      { name: "Calculus", score: 75 },
    ],
  };
  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {id}
          <span className="text-sm text-kidemia-grey">
            Created on 2025-01-12
          </span>
        </ModalHeader>
        <ModalBody className="space-y-4 py-6">
          {/* Average Score */}
          <div className="flex justify-between items-center gap-3">
            <div className="space-y-2">
              <p className="font-medium text-base text-kidemia-black2">
                Overall Score
              </p>
              <p className="text-3xl font-bold text-kidemia-primary text-center">
                {expandedData.averageScore}%
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-base text-kidemia-black2">
                Total Question
              </p>
              <p className="text-3xl font-bold text-kidemia-primary text-center">
                {expandedData.totalQuestion}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-base text-kidemia-black2">
                Attempted Question
              </p>
              <p className="text-3xl font-bold text-kidemia-primary text-center">
                {expandedData.attemptedQuestion}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-base text-kidemia-black2">
                Time Used
              </p>
              <p className="text-3xl font-bold text-kidemia-primary text-center">
                {expandedData.timeUsed}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="font-semibold text-kidemia-black">Status</p>
            <Chip color="success" variant="flat" className="capitalize mt-1">
              {expandedData.status}
            </Chip>
          </div>

          {/* Section-wise breakdown */}
          <div>
            <p className="font-semibold text-kidemia-black">
              Section Breakdown
            </p>
            <div className="mt-2 space-y-3">
              {expandedData.sections.map((sec) => (
                <div key={sec.name}>
                  <div className="flex justify-between text-sm">
                    <span>{sec.name}</span>
                    <span>{sec.score}%</span>
                  </div>
                  <Progress
                    aria-label={sec.name}
                    value={sec.score}
                    size="sm"
                    className="mt-1"
                    isStriped
                    classNames={{
                      base: "max-w-full",
                      track: "drop-shadow-md border border-default",
                      indicator: "bg-linear-to-r from-pink-500 to-yellow-500",
                      label: "tracking-wider font-medium text-default-600",
                      value: "text-foreground/60",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <p className="font-semibold text-kidemia-black">
              Evaluator's Comment
            </p>
            <p className="text-sm text-gray-700 mt-1">{expandedData.comment}</p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
