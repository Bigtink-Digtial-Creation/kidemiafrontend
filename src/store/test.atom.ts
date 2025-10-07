import { atom } from "jotai";

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

export const selectedTopicsAtom = atom<SelectedTopic[]>([]);
