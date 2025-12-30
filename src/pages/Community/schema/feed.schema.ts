// feed.schema.ts
import { z } from "zod";
import { PostSchema } from "./post.schema";

export const FeedResponseSchema = z.object({
    posts: z.array(PostSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
    has_more: z.boolean(),
    feed_type: z.enum([
        "all",
        "personalized",
        "discover",
        "subject",
        "tag",
    ]),
});

export type FeedResponse = z.infer<typeof FeedResponseSchema>;
