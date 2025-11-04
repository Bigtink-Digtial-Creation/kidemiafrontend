/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { Button, Card, CardBody, Pagination, Radio, RadioGroup, Spinner } from "@heroui/react";
import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import { selectedAssesmentAnswersAtom } from "../../store/test.atom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type OptionT = string;

export default function AssessmentQuestions() {
  const { assessment_id, attempt_id } = useParams<{
    assessment_id: string;
    attempt_id: string;
  }>();

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useAtom(selectedAssesmentAnswersAtom)

  console.log("Assessment ID:", assessment_id);
  console.log("Attempt ID:", attempt_id);

  const { data: asstQuestions, isLoading } = useQuery<any>({
    queryKey: [QueryKeys.assessmentQuestions, assessment_id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        assessment_id!,
        true,
      ),
    enabled: !!assessment_id,
  });

  console.log(asstQuestions?.questions);

  const allQuestions = useMemo(() => {
    if (!asstQuestions?.questions) return [];
    return asstQuestions.questions.map((q: any) => ({
      ...q,
      assessmentTitle: asstQuestions.title,
    }));
  }, [asstQuestions]);

  const currentQuestion = allQuestions[currentIndex]

  const handleOptionSelect = (value: OptionT) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: value
    }))
  }


  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }


  if (isLoading || !currentQuestion) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Spinner size="sm" color="warning" />
        <p className="pt-2 text-base italic text-kidemia-black text-center">Loading Questions...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6 md:px-12 w-full max-w-4xl pb-24-">
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
                  {asstQuestions.title || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Code:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {asstQuestions.code || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Session:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {asstQuestions.exam_session || "---"},{" "}
                  {asstQuestions.exam_year || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Assessment Type:
                </p>
                <p className="text-kidemia-black text-sm font-medium capitalize text-center">
                  {asstQuestions.assessment_type || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Category:
                </p>
                <p className="text-kidemia-black text-sm font-medium capitalize">
                  {asstQuestions.category || "---"}
                </p>
              </div>

              <div className="flex space-x-4 items-center">
                <p className="text-kidemia-black text-base font-medium">
                  Description:
                </p>
                <p className="text-kidemia-black text-sm font-medium">
                  {asstQuestions.description || "---"}
                </p>
              </div>

              <div className="py-4">
                <p className="text-kidemia-black text-sm font-medium leading-relaxed whitespace-pre-line">
                  {asstQuestions.instructions ||
                    "No specific instructions provided."}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="py-4">
        <div className="space-y-3">
          <h2 className="text-xl text-kidemia-black font-semibold">
            Question {currentIndex + 1}
          </h2>
          <p className="text-lg text-kidemia-grey font-medium">
            {currentQuestion.question_text}
          </p>
        </div>

        <div className="py-4">

          <RadioGroup value={selectedAnswers[currentIndex] || ""}
            onValueChange={handleOptionSelect}
            classNames={{
              wrapper: "space-y-6",
            }}
          >
            {currentQuestion.options.map((option: any) => (
              <Radio key={option.id} value={option.id} className="text-kidemia-grey font-medium"
                color="warning">
                {option.option_text}
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

        {currentIndex === allQuestions.length - 1 ? (
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            // onPress={handleSubmit}
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

      <div className="flex justify-center items-center py-2">
        <Pagination
          radius="sm"
          page={currentIndex + 1}
          total={allQuestions.length}
          classNames={{
            cursor: "border-1 bg-transparent text-kidemia-primary",
            item: "bg-transparent shadow-none cursor-pointer",
          }}
          onChange={(page) => setCurrentIndex(page - 1)}
        />
      </div>
    </section>
  );
}
