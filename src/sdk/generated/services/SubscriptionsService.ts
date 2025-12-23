/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddMemberRequest } from '../models/AddMemberRequest';
import type { RemoveMemberRequest } from '../models/RemoveMemberRequest';
import type { SubscriptionCancelRequest } from '../models/SubscriptionCancelRequest';
import type { SubscriptionCreate } from '../models/SubscriptionCreate';
import type { SubscriptionUpgradeRequest } from '../models/SubscriptionUpgradeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionsService {
  /**
   * Get My Subscriptions
   * Get all subscriptions for current user (as owner or member)
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMySubscriptionsApiV1SubscriptionsGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions',
    });
  }
  /**
   * Create Subscription
   * Create a new subscription for the current user.
   *
   * This will create a subscription in PENDING status.
   * After payment is confirmed, call the activate endpoint.
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static createSubscriptionApiV1SubscriptionsPost(
    requestBody: SubscriptionCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Activate Subscription
   * Activate subscription after successful payment
   * @param subscriptionId
   * @param paymentReference
   * @returns any Successful Response
   * @throws ApiError
   */
  public static activateSubscriptionApiV1SubscriptionsSubscriptionIdActivatePost(
    subscriptionId: string,
    paymentReference: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/activate',
      path: {
        'subscription_id': subscriptionId,
      },
      query: {
        'payment_reference': paymentReference,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Subscription
   * Get subscription details with members
   * @param subscriptionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getSubscriptionApiV1SubscriptionsSubscriptionIdGet(
    subscriptionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/{subscription_id}',
      path: {
        'subscription_id': subscriptionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Add Member
   * Add a member (ward/student) to subscription.
   * Only subscription owner can add members.
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static addMemberApiV1SubscriptionsSubscriptionIdMembersPost(
    subscriptionId: string,
    requestBody: AddMemberRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/members',
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
  /**
   * Remove Member
   * Remove a member from subscription.
   * Only subscription owner can remove members.
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static removeMemberApiV1SubscriptionsSubscriptionIdMembersDelete(
    subscriptionId: string,
    requestBody: RemoveMemberRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/subscriptions/{subscription_id}/members',
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
  /**
   * Upgrade Subscription
   * Upgrade subscription to a higher plan.
   * This will calculate prorated charges.
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static upgradeSubscriptionApiV1SubscriptionsSubscriptionIdUpgradePut(
    subscriptionId: string,
    requestBody: SubscriptionUpgradeRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
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
  /**
   * Cancel Subscription
   * Cancel subscription.
   * If cancel_immediately is False, subscription remains active until end date.
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static cancelSubscriptionApiV1SubscriptionsSubscriptionIdCancelPost(
    subscriptionId: string,
    requestBody: SubscriptionCancelRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/cancel',
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
  /**
   * Get Usage Stats
   * Get usage statistics for subscription
   * @param subscriptionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getUsageStatsApiV1SubscriptionsSubscriptionIdUsageGet(
    subscriptionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/{subscription_id}/usage',
      path: {
        'subscription_id': subscriptionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Available Plans
   * Get all available subscription plans with pricing
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAvailablePlansApiV1SubscriptionsPlansAvailableGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/plans/available',
    });
  }
  /**
   * Check Feature Access
   * Check if current user has access to a specific feature
   * @param feature
   * @returns any Successful Response
   * @throws ApiError
   */
  public static checkFeatureAccessApiV1SubscriptionsCheckFeatureFeatureGet(
    feature: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/check/feature/{feature}',
      path: {
        'feature': feature,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Check Usage Limit
   * Check if current user has exceeded usage limits
   * @param activityType
   * @returns any Successful Response
   * @throws ApiError
   */
  public static checkUsageLimitApiV1SubscriptionsCheckLimitActivityTypeGet(
    activityType: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/check/limit/{activity_type}',
      path: {
        'activity_type': activityType,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
