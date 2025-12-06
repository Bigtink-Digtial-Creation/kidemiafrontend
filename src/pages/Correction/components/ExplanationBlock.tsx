import type { QuestionCorrectionResponse } from "../../../sdk/generated";

export function ExplanationBlock({
    question,
    failed,
}: {
    question: QuestionCorrectionResponse;
    failed: boolean;
}) {
    if (!question.explanation) return null;

    return (
        <div className="bg-white rounded p-4">
            <h4 className={`font-semibold mb-2 ${failed ? "text-red-600" : "text-green-700"}`}>
                Explanation
            </h4>
            <p className="text-sm">{question.explanation}</p>
        </div>
    );
}
