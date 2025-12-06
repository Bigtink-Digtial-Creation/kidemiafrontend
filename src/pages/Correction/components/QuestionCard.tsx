import type { SingleAnswerCorrectionResponse } from "../../../sdk/generated";
import { motion } from "framer-motion";
import OptionItem from "./OptionItem";


export default function QuestionCard({ answer, index }: { answer: SingleAnswerCorrectionResponse; index: number }) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-kidemia-white rounded-2xl p-8"
        >
            <h3 className="font-bold mb-4 text-xl text-gray-900">Question {index + 1}:</h3>
            <p className="mb-6 text-gray-800 text-lg leading-relaxed">{answer.question.question_text}</p>

            <ul className="space-y-3">
                {answer.options.map((opt, i) => (
                    <OptionItem key={opt.id} option={opt} letter={letters[i]} />
                ))}
            </ul>
        </motion.section>
    );
}



