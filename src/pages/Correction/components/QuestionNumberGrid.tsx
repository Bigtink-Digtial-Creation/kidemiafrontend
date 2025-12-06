

export default function QuestionNumberGrid({
    answers,
    currentIndex,
    onChange
}: {
    answers: any[];
    currentIndex: number;
    onChange: (i: number) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {answers.map((a, i) => {
                const isCorrect = a.result.is_correct;
                const bg = isCorrect ? "bg-green-700 hover:bg-green-800" : "bg-red-600 hover:bg-red-700";
                const ring = i === currentIndex ? "ring-4 ring-yellow-400 ring-opacity-60" : "";
                return (
                    <button
                        key={a.answer_id}
                        onClick={() => onChange(i)}
                        className={`w-12 h-12 rounded-lg text-white font-bold ${bg} ${ring} flex items-center justify-center transition-all shadow-sm`}
                        aria-label={`Question ${i + 1}`}
                    >
                        {i + 1}
                    </button>
                );
            })}
        </div>
    );
}