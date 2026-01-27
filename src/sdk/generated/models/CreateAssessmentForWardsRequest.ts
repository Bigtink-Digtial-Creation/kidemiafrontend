/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create auto-generated assessment and assign to wards
 */
export type CreateAssessmentForWardsRequest = {
  subject_id: string;
  topic_ids: Array<string>;
  number_of_questions?: number;
  duration_minutes?: number;
  /**
   * Wards to assign assessment to
   */
  ward_ids: Array<string>;
  due_date?: (string | null);
  instructions?: (string | null);
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  allow_review?: boolean;
};

