import type { OptionCorrectionResponse } from "../../../sdk/generated";

export default function OptionItem({ option, letter }: { option: OptionCorrectionResponse; letter: string }) {
    const isSelected = option.selected;
    const isCorrect = option.is_correct;
    const isFailed = isSelected && !isCorrect;

    let bulletColor = "text-kidemia-secondary";
    if (isCorrect) bulletColor = "text-green-500";
    if (isFailed) bulletColor = "text-kidemia-primary";

    return (
        <li className="flex gap-3 items-start py-2">
            <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center font-semibold ${bulletColor}`}>
                {isSelected || isCorrect ? "●" : "○"}
            </div>
            <div className="flex-1 text-gray-700">
                <span className="font-medium">{letter}.</span> {option.option_text}
            </div>
        </li>
    );
}
