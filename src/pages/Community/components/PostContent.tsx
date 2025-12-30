
import { useNavigate } from "react-router";
import {
    formatTimeAgo,
    formatNumber,
    getPostTypeIcon,
    getPostTypeColor,
    getPostTypeLabel,
    getInitials,
    getAvatarColor,
} from "../utils/community.utils";
import {
    ThumbsUp,
    Bookmark,
    Eye,
    MessageCircle,
    CheckCircle,
    Pin,
    Lock,
    Bell,
    BellOff,
} from "lucide-react";
import {
    useTogglePostReaction,
    useToggleBookmark,
    useToggleFollowPost,
} from "../hooks/useCommunity";
import type { PostDetailResponse } from "../../../sdk/generated";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";
import { AuthRoutes } from "../../../routes";

interface PostContentProps {
    post: PostDetailResponse;
    isDetailView?: boolean;
}

export default function PostContent({ post }: PostContentProps) {
    const navigate = useNavigate();
    const storedUser = useAtomValue(loggedinUserAtom);
    const user = storedUser?.user;

    const toggleReaction = useTogglePostReaction(post.id);
    const toggleBookmark = useToggleBookmark(post.id);
    const toggleFollow = useToggleFollowPost(post.id);

    const handleReaction = async () => {
        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }
        await toggleReaction.mutateAsync({ reaction_type: "like" });
    };

    const handleBookmark = async () => {
        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }
        await toggleBookmark.mutateAsync({});
    };

    const handleFollow = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        await toggleFollow.mutateAsync();
    };

    return (
        <div className="bg-white rounded-lg  border border-gray-200">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Avatar */}
                        {post.author?.avatar_url ? (
                            <img
                                src={post.author.avatar_url}
                                alt={post.author.full_name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 ${getAvatarColor(
                                    post.author?.full_name || ""
                                )}`}
                            >
                                {getInitials(post.author?.full_name || "?")}
                            </div>
                        )}

                        {/* Author Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => navigate(`/community/user/${post.author_id}`)}
                                    className="font-semibold text-gray-900 hover:text-kidemia-primary transition-colors truncate"
                                >
                                    {post.author?.full_name || "Unknown"}
                                </button>
                                {post.author?.reputation_points !== undefined &&
                                    post.author.reputation_points! > 0 && (
                                        <span className="px-2 py-0.5 bg-kidemia-primary/10 text-kidemia-primary text-xs font-medium rounded-full flex-shrink-0">
                                            {formatNumber(post.author.reputation_points!)} pts
                                        </span>
                                    )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-0.5">
                                <span>{formatTimeAgo(post.created_at)}</span>
                                {post.subject_id && (
                                    <>
                                        <span>•</span>
                                        <button
                                            onClick={() => navigate(`/community/subject/${post.subject_id}`)}
                                            className="hover:text-kidemia-primary transition-colors truncate"
                                        >
                                            {post.subject_id}
                                        </button>
                                    </>
                                )}
                                {post.exam_target && (
                                    <>
                                        <span>•</span>
                                        <span className="truncate">{post.exam_target}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        {post.is_pinned && (
                            <div
                                className="p-1.5 bg-kidemia-primary/10 rounded-lg"
                                title="Pinned Post"
                            >
                                <Pin className="w-4 h-4 text-kidemia-primary" />
                            </div>
                        )}
                        {post.is_locked && (
                            <div className="p-1.5 bg-gray-100 rounded-lg" title="Locked Post">
                                <Lock className="w-4 h-4 text-gray-500" />
                            </div>
                        )}
                        {post.is_answered && (
                            <div className="p-1.5 bg-green-100 rounded-lg" title="Answered">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Type Badge */}
                <div className="mb-3">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPostTypeColor(
                            post.post_type
                        )}`}
                    >
                        <span className="mr-1.5">{getPostTypeIcon(post.post_type)}</span>
                        {getPostTypeLabel(post.post_type)}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {post.title}
                </h1>

                {/* Content */}
                <div className="prose prose-sm sm:prose max-w-none mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100">
                        {post.tags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => navigate(`/community/tag/${tag.id}`)}
                                style={{
                                    backgroundColor: tag.color + "20",
                                    color: tag.color || "#BF4C20",
                                }}
                                className="inline-flex items-center px-3 py-1.5 rounded-full 
                                text-sm font-medium hover:opacity-80 transition-opacity"
                            >
                                #{tag.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Stats & Actions */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1.5">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{formatNumber(post.view_count)}</span>
                            <span className="hidden sm:inline">views</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-medium">{formatNumber(post.reply_count)}</span>
                            <span className="hidden sm:inline">replies</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {/* Upvote */}
                        <button
                            onClick={handleReaction}
                            disabled={toggleReaction.isPending}
                            className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${post.user_has_upvoted
                                    ? "bg-kidemia-primary text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{formatNumber(post.upvote_count)}</span>
                        </button>

                        {/* Bookmark */}
                        <button
                            onClick={handleBookmark}
                            disabled={toggleBookmark.isPending}
                            className={`
                p-2 rounded-lg transition-all
                ${post.user_has_bookmarked
                                    ? "bg-kidemia-secondary text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
                            title={post.user_has_bookmarked ? "Remove bookmark" : "Bookmark"}
                        >
                            <Bookmark className="w-4 h-4" />
                        </button>

                        {/* Follow */}
                        {user && (
                            <button
                                onClick={handleFollow}
                                disabled={toggleFollow.isPending}
                                className={`
                  p-2 rounded-lg transition-all
                  ${post.user_is_following
                                        ? "bg-blue-500 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                                title={
                                    post.user_is_following ? "Unfollow this post" : "Follow this post"
                                }
                            >
                                {post.user_is_following ? (
                                    <BellOff className="w-4 h-4" />
                                ) : (
                                    <Bell className="w-4 h-4" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}