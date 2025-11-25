/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPlan } from './SubscriptionPlan';
/**
 * Schema for creating subscription
 */
export type SubscriptionCreate = {
  plan: SubscriptionPlan;
  billing_cycle: string;
  auto_renew?: boolean;
};

