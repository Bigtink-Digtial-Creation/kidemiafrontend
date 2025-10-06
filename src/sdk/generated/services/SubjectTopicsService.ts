/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from "../models/MessageResponse";
import type { TopicCreate } from "../models/TopicCreate";
import type { TopicListResponse } from "../models/TopicListResponse";
import type { TopicResponse } from "../models/TopicResponse";
import type { TopicUpdate } from "../models/TopicUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class SubjectTopicsService {
  /**
   * Create a new topic
   * Create a new topic.
   *
   * Requires `content:create` permission.
   * @param requestBody
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static createTopicApiV1TopicsPost(
    requestBody: TopicCreate,
  ): CancelablePromise<TopicResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/topics/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get topics by subject
   * Get all topics for a specific subject.
   * @param subjectId
   * @param skip
   * @param limit
   * @returns TopicListResponse Successful Response
   * @throws ApiError
   */
  public static getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
    subjectId: string,
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<TopicListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/topics/subject/{subject_id}",
      path: {
        subject_id: subjectId,
      },
      query: {
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Search topics
   * Search topics by name, code, or description.
   * @param q
   * @param subjectId
   * @param skip
   * @param limit
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static searchTopicsApiV1TopicsSearchGet(
    q: string,
    subjectId?: string | null,
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<Array<TopicResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/topics/search",
      query: {
        q: q,
        subject_id: subjectId,
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get topic by ID
   * Get a specific topic by ID.
   * @param topicId
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static getTopicApiV1TopicsTopicIdGet(
    topicId: string,
  ): CancelablePromise<TopicResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/topics/{topic_id}",
      path: {
        topic_id: topicId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update a topic
   * Update a topic.
   *
   * Requires `content:update` permission.
   * @param topicId
   * @param requestBody
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static updateTopicApiV1TopicsTopicIdPut(
    topicId: string,
    requestBody: TopicUpdate,
  ): CancelablePromise<TopicResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/topics/{topic_id}",
      path: {
        topic_id: topicId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete a topic
   * Delete a topic (soft delete).
   *
   * Requires `content:delete` permission.
   * @param topicId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteTopicApiV1TopicsTopicIdDelete(
    topicId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/topics/{topic_id}",
      path: {
        topic_id: topicId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
