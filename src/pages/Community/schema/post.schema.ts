// post.schema.ts
import { z } from "zod";
import { POST_STATUSES, POST_TYPES } from "../types/community.types";

export const PostSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string(),
    post_type: z.enum(POST_TYPES),
    subject_id: z.string().uuid().nullable(),
    exam_target: z.string().nullable(),
    tag_names: z.array(z.string()),
    status: z.enum(POST_STATUSES),
    author_id: z.string(),
    author: z.object({
        id: z.string(),
        full_name: z.string(),
        email: z.string(),
        profile_picture_url: z.string().nullable(),
        reputation_points: z.number(),
    }),
    view_count: z.number(),
    reply_count: z.number(),
    upvote_count: z.number(),
    is_answered: z.boolean(),
    accepted_answer_id: z.string().uuid().nullable(),
    is_pinned: z.boolean(),
    is_locked: z.boolean(),
    flagged_count: z.number(),
    last_activity_at: z.string(),
    tags: z.array(
        z.object({
            id: z.string().uuid(),
            name: z.string(),
            description: z.string().nullable(),
            color: z.string(),
            usage_count: z.number(),
            created_at: z.string(),
            updated_at: z.string(),
        })
    ),
    user_has_upvoted: z.boolean(),
    user_has_bookmarked: z.boolean(),
    user_is_following: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});
