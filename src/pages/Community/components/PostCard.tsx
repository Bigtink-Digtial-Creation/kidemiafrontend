import { useNavigate } from "react-router";

import {
    MessageCircle,
    Eye,
    ThumbsUp,
    Bookmark,
    CheckCircle,
    Pin,
    Lock,
} from "lucide-react";

import { loggedinUserAtom } from "../../../store/user.atom";
import type { PostResponse } from "../../../sdk/generated";
import { formatNumber, formatTimeAgo, getAvatarColor, getExcerpt, getInitials, getPostTypeColor, getPostTypeIcon } from "../utils/community.utils";
import { useAtomValue } from "jotai";
import { useToggleBookmark, useTogglePostReaction } from "../hooks/useCommunity";
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

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on interactive elements
        if ((e.target as HTMLElement).closest("button")) {
            return;
        }
        navigate(
            SidebarRoutes.postPage.replace(":postId", post.id)
        );

    };

    const handleReaction = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            // Show login modal or redirect
            return;
        }
        await toggleReaction.mutateAsync({ reaction_type: "like" });
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            return;
        }
        await toggleBookmark.mutateAsync({});
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden"
        >
            <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Avatar */}
                        {post.author?.avatar_url ? (
                            <img
                                src={post.author.avatar_url}
                                alt={post.author.full_name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(
                                    post.author?.full_name || ""
                                )}`}
                            >
                                {getInitials(post.author?.full_name || "?")}
                            </div>
                        )}

                        {/* Author Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900 truncate">
                                    {post.author?.full_name || "Unknown"}
                                </span>
                                {post.author?.reputation_points !== undefined && post.author.reputation_points! > 0 && (
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                        {formatNumber(post.author.reputation_points!)} pts
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>{formatTimeAgo(post.created_at)}</span>
                                {post.subject_id && (
                                    <>
                                        <span>•</span>
                                        <span className="truncate">{post.subject_id}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                        {post.is_pinned && (
                            <div className="p-1 bg-kidemia-primary/10 rounded">
                                <Pin className="w-4 h-4 text-kidemia-primary" />
                            </div>
                        )}
                        {post.is_locked && (
                            <div className="p-1 bg-gray-100 rounded">
                                <Lock className="w-4 h-4 text-gray-500" />
                            </div>
                        )}
                        {post.is_answered && (
                            <div className="p-1 bg-green-100 rounded">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Type Badge */}
                <div className="mb-2">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPostTypeColor(
                            post.post_type
                        )}`}
                    >
                        <span className="mr-1">{getPostTypeIcon(post.post_type)}</span>
                        {post.post_type?.replace("_", " ")}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-kidemia-primary transition-colors">
                    {post.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {getExcerpt(post.content, 200)}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/community/tag/${tag.id}`);
                                }}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                #{tag.name}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-gray-500">
                                +{post.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(post.view_count)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{formatNumber(post.reply_count)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleReaction}
                            disabled={toggleReaction.isPending}
                            className={`
                flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${post.user_has_upvoted
                                    ? "bg-kidemia-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
              `}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{formatNumber(post.upvote_count)}</span>
                        </button>

                        <button
                            onClick={handleBookmark}
                            disabled={toggleBookmark.isPending}
                            className={`
                p-1.5 rounded-md transition-all
                ${post.user_has_bookmarked
                                    ? "bg-kidemia-secondary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
              `}
                        >
                            <Bookmark className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}