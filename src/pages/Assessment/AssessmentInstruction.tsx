import { Button } from "@heroui/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { assessmentAtom } from "../../store/test.atom";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import { AssessmentRoutes } from "../../routes";

export default function AssessmentInstruction() {
  const assessment = useAtomValue(assessmentAtom);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <section className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg text-center font-bold text-kidemia-black">
          Assessment Instructions
        </h3>
        <p className="text-kidemia-grey text-base text-center">
          Please review these details carefully before starting your assessment.
        </p>
      </div>

      {/* Welcome + Assessment Summary */}
      <div className="rounded-xl border border-kidemia-grey/20 bg-white p-6 space-y-4 shadow-sm">
        <div className="space-y-3 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="font-semibold text-kidemia-black">
              {assessment?.title}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-kidemia-grey">Duration:</span>
            <span className="font-semibold text-kidemia-black">
              {assessment?.timeMins} minutes
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-kidemia-grey">
              Total Questions:
            </span>
            <span className="font-semibold text-kidemia-black">
              {assessment?.questionsNo} questions
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-kidemia-grey">Total Marks:</span>
            <span className="font-semibold text-kidemia-primary">
              {assessment?.avgScore} marks
            </span>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-kidemia-black">
          What You Should Know...
        </h3>

        <div className="space-y-3">
          {[
            "You are required to attempt all questions.",
            "You cannot exit the assessment once you begin.",
            "Closing the window or browser will be treated as submission.",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2">
              <IoIosInformationCircleOutline className="text-red-500 text-xl mt-0.5 shrink-0" />
              <p className="text-red-500 text-base">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
        <Button
          variant="faded"
          radius="sm"
          size="md"
          className="w-full border border-kidemia-grey/30 text-kidemia-primary"
          onPress={() => navigate(-1)}
        >
          Go Back
        </Button>

        <Button
          radius="sm"
          size="md"
          className="w-full bg-kidemia-secondary text-white font-semibold"
          onPress={() => navigate(AssessmentRoutes.assesmentAttempt.replace(":assessment_id", id!))}
        >
          Start Assessment
        </Button>
      </div>
    </section>
  );
}
