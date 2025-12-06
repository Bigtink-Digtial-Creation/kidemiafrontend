import type { OptionCorrectionResponse } from "../../../sdk/generated";

export default function OptionItem({ option, letter }: { option: OptionCorrectionResponse; letter: string }) {
    const isSelected = option.selected;
    const isCorrect = option.is_correct;
    const isFailed = isSelected && !isCorrect;

    // Bullet color logic
    let bulletColor = "text-gray-400";
    if (isCorrect) bulletColor = "text-green-600";
    if (isFailed) bulletColor = "text-red-600";

    // Symbol logic: bullet or check/cross
    let symbol = isSelected || isCorrect ? "●" : "○";
    if (isCorrect) symbol = "✓";
    else if (isFailed) symbol = "✗";

    return (
        <li className="flex gap-3 items-center py-2">
            <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center font-semibold ${bulletColor}`}>
                {symbol}
            </div>
            <div className="flex-1 text-gray-700">
                <span className="font-medium">{letter}.</span> {option.option_text}
            </div>
        </li>
    );
}
