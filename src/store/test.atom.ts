import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type SelectedTopic = {
  id: string;
  name: string;
  description: string;
  code: string;
  estimated_time_minutes: number;
  questions_count: number;
  difficulty_level: string;
};

export type AssessmentDetails = {
  title: string;
  code: string;
  avgScore: string;
  timeMins: number;
  questionsNo: number;
};

export const selectedSubjectTitleAtom = atom<string | null>(null);
export const selectedSubjectIdeAtom = atom<string | null>(null);

export const selectedTopicsAtom = atom<SelectedTopic[]>([]);

export const selectedAnswersAtom = atomWithStorage<{ [key: number]: string }>(
  "selectedAnswers",
  {},
);

export const assessmentAtom = atomWithStorage<AssessmentDetails | null>(
  "kidemia-assessment",
  null,
);

export const selectedAssesmentAnswersAtom = atomWithStorage<{
  [key: number]: string;
}>("selectedAssessmentAnswers", {});
