import type { SingleAnswerCorrectionResponse } from "../../../sdk/generated";
import { motion } from "framer-motion";
import OptionItem from "./OptionItem";
import QuestionRenderer from "../../../components/editor/QuestionRenderer";

export default function QuestionCard({
    answer,
    index,
}: {
    answer: SingleAnswerCorrectionResponse;
    index: number;
}) {
    const letters = ["A", "B", "C", "D", "E", "F"];

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-kidemia-white rounded-2xl p-8"
        >
            <h3 className="font-bold mb-4 text-xl text-gray-900">
                Question {index + 1}:
            </h3>

            {/* ── Question text ── */}
            <div className="mb-6 text-gray-800 text-lg leading-relaxed">
                <QuestionRenderer
                    key={answer.question.id}
                    question_content={(answer.question as any).question_content ?? null}
                    question_text={answer.question.question_text}
                    className="text-gray-800 text-lg leading-relaxed"
                />
            </div>

            {/* ── Image if present ── */}
            {answer.question.image_url && (
                <img
                    src={answer.question.image_url}
                    alt="Question visual"
                    className="mb-6 max-h-64 rounded-xl object-contain border border-gray-100"
                />
            )}

            <ul className="space-y-3">
                {answer.options.map((opt, i) => (
                    <OptionItem key={opt.id} option={opt} letter={letters[i]} />
                ))}
            </ul>

            {/* ── Explanation ── shown if answer is wrong and explanation exists ── */}
            {!answer.result?.is_correct && answer.question.explanation && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                        Explanation
                    </p>
                    <QuestionRenderer
                        key={`${answer.question.id}-explanation`}
                        question_content={
                            (answer.question as any).explanation_content ?? null
                        }
                        question_text={answer.question.explanation}
                        className="text-amber-800 text-sm leading-relaxed"
                    />
                </div>
            )}
        </motion.section>
    );
}