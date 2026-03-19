/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassroomResponse } from './ClassroomResponse';
export type TeacherResponse = {
  id: string;
  user_id: string;
  institution_id: string;
  teacher_code: string;
  full_name: (string | null);
  email: string;
  specialization: (string | null);
  is_active: boolean;
  is_suspended: boolean;
  joined_date: string;
  taught_classes_count?: number;
  taught_classes?: Array<ClassroomResponse>;
  homeroom_class?: (ClassroomResponse | null);
};

