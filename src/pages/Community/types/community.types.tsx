/**
 * Kidemia Community/Forum - TypeScript Types
 * File: src/types/community.types.ts
 */

export enum PostType {
    QUESTION = "question",
    DISCUSSION = "discussion",
    STUDY_GROUP = "study_group",
    RESOURCE_SHARE = "resource_share",
    ANNOUNCEMENT = "announcement",
}

export enum PostStatus {
    ACTIVE = "active",
    CLOSED = "closed",
    ARCHIVED = "archived",
    FLAGGED = "flagged",
}

export enum ReactionType {
    LIKE = "like",
    HELPFUL = "helpful",
    INSIGHTFUL = "insightful",
    CELEBRATE = "celebrate",
}

export interface AuthorInfo {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    reputation_points?: number;
}

export interface TagResponse {
    id: string;
    name: string;
    description?: string;
    color: string;
    usage_count: number;
    created_at: string;
}

export interface PostResponse {
    id: string;
    title: string;
    content: string;
    post_type: PostType;
    status: PostStatus;
    author_id: string;
    author?: AuthorInfo;
    subject_id?: string;
    grade_level?: string;
    view_count: number;
    reply_count: number;
    upvote_count: number;
    is_answered: boolean;
    accepted_answer_id?: string;
    is_pinned: boolean;
    is_locked: boolean;
    flagged_count: number;
    created_at: string;
    updated_at: string;
    last_activity_at: string;
    tags: TagResponse[];
    user_has_upvoted?: boolean;
    user_has_bookmarked?: boolean;
    user_is_following?: boolean;
    tag_names: string[];
}

export interface ReplyResponse {
    id: string;
    content: string;
    post_id: string;
    author_id: string;
    author?: AuthorInfo;
    parent_reply_id?: string;
    upvote_count: number;
    is_accepted_answer: boolean;
    is_edited: boolean;
    flagged_count: number;
    created_at: string;
    updated_at: string;
    child_replies: ReplyResponse[];
    user_has_upvoted?: boolean;
}

export interface PostDetailResponse extends PostResponse {
    replies: ReplyResponse[];
}

export interface PostListResponse {
    posts: PostResponse[];
    total: number;
    page: number;
    page_size: number;
    has_more: boolean;
}

export interface FeedResponse {
    posts: PostResponse[];
    total: number;
    page: number;
    page_size: number;
    has_more: boolean;
    feed_type?: string;
}

export interface ForumStats {
    total_posts: number;
    total_replies: number;
    active_discussions: number;
    answered_questions: number;
}

export interface TrendingPost {
    id: string;
    title: string;
    post_type: PostType;
    reply_count: number;
    view_count: number;
    upvote_count: number;
    created_at: string;
}

export interface PopularTag {
    id: string;
    name: string;
    usage_count: number;
    color: string;
}

export interface PostCreate {
    title: string;
    content: string;
    post_type: PostType;
    subject_id?: string;
    grade_level?: string;
    tag_names: string[];
}

export interface ReplyCreate {
    content: string;
    parent_reply_id?: string;
}

export interface NotificationResponse {
    id: string;
    notification_type: string;
    title: string;
    message: string;
    post_id?: string;
    reply_id?: string;
    triggering_user_id?: string;
    is_read: boolean;
    created_at: string;
    read_at?: string;
}

export const POST_TYPES = [
    "question",
    "discussion",
    "resource_share",
    "study_group",
    "announcement",
] as const;

export const POST_STATUSES = [
    "active",
    "closed",
    "archived",
    "flagged"
] as const;

export type PostStatus2 = typeof POST_STATUSES[number];


export type PostType2 = typeof POST_TYPES[number];


export type FeedType = "all" | "trending" | "unanswered" | "popular" | "following" | "subjects";
export type SortBy = "recent" | "popular" | "trending" | "unanswered";