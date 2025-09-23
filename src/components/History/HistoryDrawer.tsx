import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Divider,
} from "@heroui/react";

interface DrawerI {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string | null;
}

export default function HistoryDrawer({ isOpen, onOpenChange, id }: DrawerI) {
  const subjectDetails = {
    averageScore: 78,
    remark: "Good performance, but room for improvement.",
    dateTaken: "2025-01-12",
    timeUsed: "45 mins",
    avgTimePerQuestion: "1.5 mins",
    tutorComment:
      "The student shows strong understanding in algebra but struggles with geometry. Recommend more practice on word problems.",
    totalTopics: 3,
    topics: [
      { name: "Algebra", questions: 15, correct: 12, color: "bg-blue-500" },
      { name: "Geometry", questions: 10, correct: 6, color: "bg-green-500" },
      { name: "Statistics", questions: 5, correct: 4, color: "bg-purple-500" },
    ],
  };
  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        backdrop="blur"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1 text-xl font-bold">
            {id} Details
          </DrawerHeader>

          <DrawerBody className="space-y-6">
            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200">
                <p className="font-semibold">Average Score</p>
                <p className="text-indigo-700 font-bold text-xl">
                  {subjectDetails.averageScore}%
                </p>
              </div>
              <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-pink-100 to-pink-200">
                <p className="font-semibold">Remark</p>
                <p className="text-pink-700">{subjectDetails.remark}</p>
              </div>
              <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-200">
                <p className="font-semibold">Date Taken</p>
                <p className="text-yellow-700">{subjectDetails.dateTaken}</p>
              </div>
              <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-green-100 to-green-200">
                <p className="font-semibold">Time Used</p>
                <p className="text-green-700">{subjectDetails.timeUsed}</p>
              </div>
              <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
                <p className="font-semibold">Avg. Time/Question</p>
                <p className="text-blue-700">
                  {subjectDetails.avgTimePerQuestion}
                </p>
              </div>
            </div>

            <Divider />

            {/* Tutor Comment */}
            <div className="py-3 px-4 space-y-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200">
              <p className="font-semibold mb-1">Tutor’s Comment</p>
              <p className="text-sm text-purple-800">
                {subjectDetails.tutorComment}
              </p>
            </div>

            <Divider />

            {/* Topics Breakdown */}
            <div>
              <p className="font-semibold mb-3 text-lg">
                Topics Covered ({subjectDetails.totalTopics})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjectDetails.topics.map((topic, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl text-white shadow-md ${topic.color}`}
                  >
                    <p className="font-bold text-lg">{topic.name}</p>
                    <p className="text-sm">
                      Questions:{" "}
                      <span className="font-semibold">{topic.questions}</span>
                    </p>
                    <p className="text-sm">
                      Correct:{" "}
                      <span className="font-semibold">{topic.correct}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
