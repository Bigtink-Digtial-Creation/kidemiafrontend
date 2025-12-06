export interface AttemptSummary {
    id: string;
    status: string;
    score: number;
    percentage: number;
    points_earned: number;
    points_possible: number;
    passed: boolean;
    time_spent_seconds: number;
    submitted_at: string;
}

export interface QuestionMedia {
    image_url: string | null;
    video_url: string | null;
    audio_url: string | null;
}

export interface QuestionCorrection extends QuestionMedia {
    id: string;
    question_text: string;
    question_type: string;
    explanation: string | null;
    points: number | null;
}

export interface OptionCorrection {
    id: string;
    option_text: string;
    is_correct: boolean;
    selected: boolean;
    image_url: string | null;
}

export interface AnswerResult {
    is_correct: boolean;
    is_partially_correct: boolean;
    points_earned: number;
    points_possible: number;
}

export interface UserAnswer {
    selected_option_ids: string[] | null;
    text_answer: string | null;
    matching_pairs: any | null;
    ordered_items: any | null;
}

export interface AnswerCorrection {
    answer_id: string;
    question: QuestionCorrection;
    options: OptionCorrection[];
    user_answer: UserAnswer;
    result: AnswerResult;
}

export interface AttemptCorrectionResponse {
    attempt: AttemptSummary;
    answers: AnswerCorrection[];
}
