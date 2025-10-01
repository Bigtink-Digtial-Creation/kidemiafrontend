/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Button,
  Pagination,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@heroui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { questions } from "../../staticData";
import ResultWaiting from "./Modal/ResultWaiting";

type AnswerOption = "a" | "b" | "c" | "d" | "e";

type SelectedAnswers = {
  [key: number]: AnswerOption;
};

export default function QuestionsPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const currentQuestion = questions[currentIndex];

  const resultModal = useDisclosure();

  const handleAnswerSelect = (value: AnswerOption | any) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    resultModal.onOpen();
  };

  return (
    <section className="py-4 space-y-12 md:px-12 w-full max-w-4xl">
      <div className="absolute top-0 right-0 px-8 pt-2.5">
        <div className="flex justify-between flex-col md:flex-row items-center gap-2 space-x-6">
          <p className="text-md text-kidemia-black font-medium">
            Time Left: 10mins: 54 Secs
          </p>
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-3">
          <h2 className="text-xl text-kidemia-black font-semibold">
            Question {currentIndex + 1}
          </h2>
          <p className="text-lg text-kidemia-grey font-medium">
            {currentQuestion.question}
          </p>
        </div>

        <div className="py-6">
          <RadioGroup
            value={selectedAnswers[currentIndex] || ""}
            onValueChange={handleAnswerSelect}
            classNames={{
              wrapper: "space-y-6",
            }}
          >
            {currentQuestion.options.map((option, idx) => (
              <Radio
                key={idx}
                value={option.charAt(0)}
                className="text-kidemia-grey font-medium"
                color="warning"
              >
                {option}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center space-x-6 py-6">
        <Button
          className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
          variant="faded"
          size="md"
          radius="sm"
          type="button"
          startContent={<FaArrowLeft />}
          onPress={handlePrev}
          isDisabled={currentIndex === 0}
        >
          Previous
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            onPress={handleSubmit}
            isDisabled={!selectedAnswers[currentIndex]}
          >
            Submit
          </Button>
        ) : (
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            endContent={<FaArrowRight />}
            onPress={handleNext}
            isDisabled={!selectedAnswers[currentIndex]}
          >
            Next
          </Button>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center py-4">
        <Pagination
          radius="sm"
          page={currentIndex + 1}
          total={questions.length}
          classNames={{
            cursor: "border-1 bg-transparent text-kidemia-primary",
            item: "bg-transparent shadow-none cursor-pointer",
          }}
          onChange={(page) => setCurrentIndex(page - 1)}
        />
      </div>

      <ResultWaiting
        isOpen={resultModal.isOpen}
        onClose={resultModal.onClose}
      />
    </section>
  );
}
