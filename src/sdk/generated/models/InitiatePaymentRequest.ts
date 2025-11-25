/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentMethod } from './PaymentMethod';
/**
 * Request to initiate payment
 */
export type InitiatePaymentRequest = {
  assessment_id?: (string | null);
  subscription_plan?: (string | null);
  amount: (number | string);
  payment_method: PaymentMethod;
  callback_url?: (string | null);
};

