import type { QuestionCorrectionResponse } from "../../../sdk/generated";


export default function MediaBlock({ question }: { question: QuestionCorrectionResponse }) {
    if (!question.image_url && !question.video_url && !question.audio_url) return null;

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
            {question.image_url && (
                <img src={question.image_url} alt="Question visual" className="w-full object-contain max-h-80" />
            )}
            {question.video_url && (
                <video controls className="w-full">
                    <source src={question.video_url} />
                </video>
            )}
            {question.audio_url && (
                <audio controls className="w-full p-4">
                    <source src={question.audio_url} />
                </audio>
            )}
        </div>
    );
}
