import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import type {
  FeedType,
  ForumStats,
} from "../types/community.types";

import { ApiSDK } from "../../../sdk";
import { type BookmarkCreate, type NotificationResponse, type PopularTag, type PostCreate, type PostDetailResponse, type PostUpdate, type ReactionCreate, type ReplyCreate, type ReplyUpdate, type TagResponse, type TrendingPost, type UserProfileResponse } from "../../../sdk/generated";
import { FeedResponseSchema } from "../schema/feed.schema";

export function usePersonalizedFeed(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["community", "feed", "personalized"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res =
        await ApiSDK.ForumFeedService
          .getPersonalizedFeedApiV1FeedPersonalizedGet(
            pageParam,
            pageSize,
          );
      return FeedResponseSchema.parse(res);
    },

    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
  });
}

export function useDiscoverFeed(feedType: FeedType, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["community", "feed", "discover", feedType],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res =
        await ApiSDK.ForumFeedService
          .getDiscoverFeedApiV1FeedDiscoverGet(
            feedType,
            pageParam,
            pageSize,
          );

      return FeedResponseSchema.parse(res);
    },
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
  });
}

export function useSubjectFeed(subjectId: string, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["community", "feed", "subject", subjectId],
    enabled: !!subjectId,
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res =
        await ApiSDK.ForumFeedService
          .getSubjectFeedApiV1FeedSubjectSubjectIdGet(subjectId, pageParam, pageSize);
      return FeedResponseSchema.parse(res);
    },
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
  });
}

export function useTagFeed(tagId: string, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["community", "feed", "tag", tagId],
    enabled: !!tagId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res =
        await ApiSDK.ForumFeedService
          .getTagFeedApiV1FeedTagTagIdGet(tagId, pageParam, pageSize);
      console.log(res)
      return FeedResponseSchema.parse(res);
    },
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
  });
}


export function useHomeFeed() {
  return useQuery({
    queryKey: ["community", "feed", "home"],
    queryFn: () => ApiSDK.ForumFeedService.getHomeFeedApiV1FeedHomeGet(),
  });
}

export function useRecommendedPosts(limit = 5) {
  return useQuery({
    queryKey: ["community", "recommended", limit],
    queryFn: () =>
      ApiSDK.ForumFeedService.getRecommendedPostsApiV1FeedRecommendedGet(limit),
  });
}

export function useQuestionsForYou(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["community", "questions-for-you", page],
    queryFn: () =>
      ApiSDK.ForumFeedService.getQuestionsForYouApiV1FeedQuestionsForYouGet(
        page,
        pageSize,
      ),
  });
}

// POST HOOKS 

export function usePost(postId: string) {
  return useQuery<PostDetailResponse>({
    queryKey: ["community", "post", postId],
    enabled: !!postId,
    queryFn: () =>
      ApiSDK.CommunityService.getPostApiV1ForumPostsPostIdGet(postId),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostCreate) =>
      ApiSDK.CommunityService.createPostApiV1ForumPostsPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "feed"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["community", "stats"],
      });
    },
  });
}

export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostUpdate) =>
      ApiSDK.CommunityService.updatePostApiV1ForumPostsPostIdPatch(
        postId,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["community", "feed"],
        exact: false,
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      ApiSDK.CommunityService.deletePostApiV1ForumPostsPostIdDelete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "feed"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["community", "stats"],
      });
    },
  });
}

//  REPLY HOOKS

export function useCreateReply(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReplyCreate) =>
      ApiSDK.CommunityService.createReplyApiV1ForumPostsPostIdRepliesPost(
        postId,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
    },
  });
}

export function useUpdateReply(postId: string, replyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: ReplyUpdate) =>
      ApiSDK.CommunityService.updateReplyApiV1ForumRepliesReplyIdPatch(
        replyId,
        content,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
    },
  });
}

export function useDeleteReply(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: string) =>
      ApiSDK.CommunityService.deleteReplyApiV1ForumRepliesReplyIdDelete(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
    },
  });
}

export function useAcceptAnswer(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: string) =>
      ApiSDK.CommunityService.acceptAnswerApiV1ForumPostsPostIdRepliesReplyIdAcceptPost(
        postId,
        replyId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
    },
  });
}

// ============ REACTION HOOKS ============

export function useTogglePostReaction(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reaction: ReactionCreate) =>
      ApiSDK.CommunityService.togglePostReactionApiV1ForumPostsPostIdReactionsPost(
        postId,
        reaction,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["community", "feed"],
        exact: false,
      });
    },
  });
}

export function useToggleReplyReaction(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      replyId,
      reactionType,
    }: {
      replyId: string;
      reactionType: ReactionCreate;
    }) =>
      ApiSDK.CommunityService.toggleReplyReactionApiV1ForumRepliesReplyIdReactionsPost(replyId, reactionType,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
    },
  });
}

// ============ BOOKMARK HOOKS ============

export function useToggleBookmark(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notes?: BookmarkCreate) =>
      ApiSDK.CommunityService.toggleBookmarkApiV1ForumPostsPostIdBookmarkPost(
        postId,
        notes,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["community", "bookmarks"],
      });
    },
  });
}

export function useBookmarks() {
  return useQuery({
    queryKey: ["community", "bookmarks"],
    queryFn: () =>
      ApiSDK.CommunityService.getMyBookmarksApiV1ForumBookmarksGet(),
  });
}

// ============ FOLLOW HOOKS ============

export function useToggleFollowPost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      ApiSDK.CommunityService.toggleFollowPostApiV1ForumPostsPostIdFollowPost(postId),

    // 1️⃣ Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["community", "post", postId],
      });

      const previousPost = queryClient.getQueryData<any>([
        "community",
        "post",
        postId,
      ]);

      if (previousPost) {
        queryClient.setQueryData(
          ["community", "post", postId],
          {
            ...previousPost,
            isFollowing: !previousPost.isFollowing,
            followersCount: previousPost.isFollowing
              ? previousPost.followersCount - 1
              : previousPost.followersCount + 1,
          }
        );
      }

      return { previousPost };
    },

    // 2️⃣ Rollback if error
    onError: (_err, _vars, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["community", "post", postId],
          context.previousPost
        );
      }
    },

    // 3️⃣ Optional background sync
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "post", postId],
      });
    },
  });
}


// ============ TAG HOOKS ============

export function useTags() {
  return useQuery<TagResponse[]>({
    queryKey: ["community", "tags"],
    queryFn: () =>
      ApiSDK.CommunityService.getAllTagsApiV1ForumTagsGet(),
  });
}

export function usePopularTags(limit = 20) {
  return useQuery<PopularTag[]>({
    queryKey: ["community", "tags", "popular", limit],
    queryFn: () =>
      ApiSDK.CommunityService.getPopularTagsApiV1ForumTagsPopularGet(limit),
  });
}

// ============ STATISTICS HOOKS ============

export function useForumStats() {
  return useQuery<ForumStats>({
    queryKey: ["community", "stats"],
    queryFn: () =>
      ApiSDK.CommunityService.getForumStatisticsApiV1ForumStatsGet(),
  });
}

export function useTrendingPosts(limit = 10) {
  return useQuery<TrendingPost[]>({
    queryKey: ["community", "trending", limit],
    queryFn: () =>
      ApiSDK.CommunityService.getTrendingPostsApiV1ForumTrendingGet(limit),
  });
}

// NOTIFICATION HOOKS 

export function useNotifications(unreadOnly = false) {
  return useQuery<NotificationResponse[]>({
    queryKey: ["community", "notifications", unreadOnly],
    queryFn: () =>
      ApiSDK.CommunityService.getMyNotificationsApiV1ForumNotificationsGet(unreadOnly),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      ApiSDK.CommunityService.markNotificationReadApiV1ForumNotificationsNotificationIdReadPatch(notificationId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "notifications"],
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      ApiSDK.CommunityService.markAllNotificationsReadApiV1ForumNotificationsReadAllPost(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "notifications"],
      });
    },
  });
}


export function useUserProfile(userId: string) {
  return useQuery<UserProfileResponse>({
    queryKey: ["community", "user", userId],
    queryFn: () => ApiSDK.CommunityService.getUserProfileApiV1ForumUsersUserIdProfileGet(userId),
    enabled: !!userId,
  });
}

export function useUserActivityFeed(userId: string, pageSize: number = 20) {
  return useInfiniteQuery({
    queryKey: ["community", "user", userId, "posts"],
    queryFn: ({ pageParam = 1 }) =>
      ApiSDK.ForumFeedService.getUserActivityFeedApiV1FeedUserUserIdGet(
        userId,
        pageParam,
        pageSize,
      ),
    getNextPageParam: (lastPage) => {
      return lastPage.has_more ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });
}

export function useUserReputation(userId: string) {
  return useQuery({
    queryKey: ["community", "user", userId, "reputation"],
    queryFn: () => ApiSDK.CommunityService.getUserReputationApiV1ForumUsersUserIdReputationGet(userId),
    enabled: !!userId,
  });
}