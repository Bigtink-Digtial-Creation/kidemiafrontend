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

export const selectedSubjectTitleAtom = atom<string | null>(null);
export const selectedSubjectIdeAtom = atom<string | null>(null);


export const selectedTopicsAtom = atom<SelectedTopic[]>([]);

export const selectedAnswersAtom = atomWithStorage<{ [key: number]: string }>(
  "selectedAnswers",
  {},
);
