/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPlan } from './SubscriptionPlan';
import type { SubscriptionStatus } from './SubscriptionStatus';
/**
 * Schema for subscription response
 */
export type SubscriptionResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  plan: SubscriptionPlan;
  billing_cycle: string;
  auto_renew?: boolean;
  subscription_reference: string;
  status: SubscriptionStatus;
  user_id: string;
  institution_id: (string | null);
  price: string;
  currency: string;
  start_date: string;
  end_date: string;
  trial_end_date: (string | null);
  next_billing_date: (string | null);
  exams_taken: number;
  exams_limit: (number | null);
  is_active: boolean;
  days_remaining: number;
};

