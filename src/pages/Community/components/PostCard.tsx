import { useNavigate } from "react-router";
import {
    MessageCircle,
    Eye,
    ThumbsUp,
    Bookmark,
    CheckCircle,
    Pin,
    Lock,
    Bell,
} from "lucide-react";
import { useState } from "react";

import { loggedinUserAtom } from "../../../store/user.atom";
import type { PostResponse } from "../../../sdk/generated";
import {
    formatNumber,
    formatTimeAgo,
    getAvatarColor,
    getExcerpt,
    getInitials,
} from "../utils/community.utils";
import { useAtomValue } from "jotai";
import {
    useToggleBookmark,
    useToggleFollowPost,
    useTogglePostReaction,
    useUserProfile,
} from "../hooks/useCommunity";
import { SidebarRoutes } from "../../../routes";

interface PostCardProps {
    post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
    const navigate = useNavigate();
    const storedUser = useAtomValue(loggedinUserAtom);
    const user = storedUser?.user;

    const toggleReaction = useTogglePostReaction(post.id);
    const toggleBookmark = useToggleBookmark(post.id);
    const toggleFollowPost = useToggleFollowPost(post.id);

    const { data: userData } = post.author_id
        ? useUserProfile(post.author_id)
        : { data: undefined };

    /* ---------------- OPTIMISTIC STATE ---------------- */

    const [liked, setLiked] = useState(post.user_has_upvoted);
    const [likeCount, setLikeCount] = useState(post.upvote_count);

    const [bookmarked, setBookmarked] = useState(post.user_has_bookmarked);
    const [following, setFollowing] = useState(post.user_is_following);

    /* ---------------- HANDLERS ---------------- */

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        navigate(SidebarRoutes.postPage.replace(":postId", post.id));
    };

    const handleReaction = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        // optimistic update
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

        try {
            await toggleReaction.mutateAsync({ reaction_type: "like" });
        } catch {
            // rollback on failure
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        setBookmarked((prev) => !prev);

        try {
            await toggleBookmark.mutateAsync({});
        } catch {
            setBookmarked((prev) => !prev);
        }
    };

    const handleFollowPost = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        setFollowing((prev) => !prev);

        try {
            await toggleFollowPost.mutateAsync();
        } catch {
            setFollowing((prev) => !prev);
        }
    };

    /* ---------------- RENDER ---------------- */

    return (
        <article
            onClick={handleCardClick}
            className="
                w-full bg-white cursor-pointer
                px-4 py-5 sm:px-5
                transition-colors
                hover:bg-gray-50
                border-b border-gray-100
                hover:border-transparent
            "
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {post.author?.profile_picture_url ? (
                        <img
                            src={post.author.profile_picture_url}
                            alt={post.author?.full_name || "User avatar"}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${getAvatarColor(
                                post.author?.full_name || ""
                            )}`}
                        >
                            {getInitials(post.author?.full_name || "?")}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 truncate">
                                {post.author?.full_name || "Unknown"}
                            </span>

                            {userData?.reputation_meta?.total_points! > 0 && (
                                <span className="text-xs text-gray-500">
                                    {formatNumber(
                                        userData!.reputation_meta.total_points
                                    )}{" "}
                                    pts
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span>{formatTimeAgo(post.created_at)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {post.is_pinned && (
                        <Pin className="w-4 h-4 text-kidemia-primary" />
                    )}
                    {post.is_locked && (
                        <Lock className="w-4 h-4 text-gray-400" />
                    )}
                    {post.is_answered && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {getExcerpt(post.content, 200)}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(post.view_count)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{formatNumber(post.reply_count)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReaction}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition
                            ${liked
                                ? "bg-kidemia-primary text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{formatNumber(likeCount)}</span>
                    </button>

                    <button
                        onClick={handleBookmark}
                        className={`p-1.5 rounded-md transition
                            ${bookmarked
                                ? "bg-kidemia-secondary text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleFollowPost}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition
                            ${following
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <Bell className="w-4 h-4" />
                        <span>{following ? "Following" : "Follow"}</span>
                    </button>
                </div>
            </div>
        </article>
    );
}
