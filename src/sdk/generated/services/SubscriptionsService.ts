/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionCreate } from '../models/SubscriptionCreate';
import type { SubscriptionResponse } from '../models/SubscriptionResponse';
import type { SubscriptionUpgradeRequest } from '../models/SubscriptionUpgradeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionsService {
  /**
   * Create subscription
   * Create a new subscription.
   *
   * Plans:
   * - **FREE**: Basic access, 3 exams/month
   * - **BASIC**: NGN 2,000/month, 10 exams/month
   * - **PREMIUM**: NGN 5,000/month, unlimited exams
   * - **INSTITUTION**: NGN 50,000/month, institution features
   *
   * Billing cycles: monthly, quarterly, yearly
   * @param requestBody
   * @returns SubscriptionResponse Successful Response
   * @throws ApiError
   */
  public static createSubscriptionApiV1SubscriptionsPost(
    requestBody: SubscriptionCreate,
  ): CancelablePromise<SubscriptionResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get my active subscription
   * Get active subscription for current user.
   * @returns SubscriptionResponse Successful Response
   * @throws ApiError
   */
  public static getMySubscriptionApiV1SubscriptionsMySubscriptionGet(): CancelablePromise<SubscriptionResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/my-subscription',
    });
  }
  /**
   * Cancel subscription
   * Cancel a subscription.
   *
   * Subscription remains active until end date.
   * Auto-renewal will be disabled.
   * @param subscriptionId
   * @param reason
   * @returns SubscriptionResponse Successful Response
   * @throws ApiError
   */
  public static cancelSubscriptionApiV1SubscriptionsSubscriptionIdCancelPost(
    subscriptionId: string,
    reason?: (string | null),
  ): CancelablePromise<SubscriptionResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/cancel',
      path: {
        'subscription_id': subscriptionId,
      },
      query: {
        'reason': reason,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Upgrade subscription
   * Upgrade subscription to a higher plan.
   *
   * Prorated charges apply for immediate upgrades.
   * @param subscriptionId
   * @param requestBody
   * @returns SubscriptionResponse Successful Response
   * @throws ApiError
   */
  public static upgradeSubscriptionApiV1SubscriptionsSubscriptionIdUpgradePost(
    subscriptionId: string,
    requestBody: SubscriptionUpgradeRequest,
  ): CancelablePromise<SubscriptionResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/upgrade',
      path: {
        'subscription_id': subscriptionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
