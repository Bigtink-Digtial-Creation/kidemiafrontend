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
    useUserProfile,
} from "../hooks/useCommunity";
import type { PostDetailResponse } from "../../../sdk/generated";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";
import { AuthRoutes, SidebarRoutes } from "../../../routes";
import { useState } from "react";

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

    const { data: userData } = useUserProfile(post.author_id!);


    const [liked, setLiked] = useState(post.user_has_upvoted);
    const [likeCount, setLikeCount] = useState(post.upvote_count);
    const [bookmarked, setBookmarked] = useState(post.user_has_bookmarked);
    const [following, setFollowing] = useState(post.user_is_following);


    const handleReaction = async () => {
        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }

        // optimistic update
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

        try {
            await toggleReaction.mutateAsync({ reaction_type: "like" });
        } catch {
            // rollback
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        }
    };

    const handleBookmark = async () => {
        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }

        setBookmarked((prev) => !prev);

        try {
            await toggleBookmark.mutateAsync({});
        } catch {
            setBookmarked((prev) => !prev);
        }
    };

    const handleFollow = async () => {
        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }

        setFollowing((prev) => !prev);

        try {
            await toggleFollow.mutateAsync();
        } catch {
            setFollowing((prev) => !prev);
        }
    };

    return (
        <div className="">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {post.author?.profile_picture_url ? (
                            <img
                                src={post.author.profile_picture_url}
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

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() =>
                                        navigate(
                                            SidebarRoutes.userProfile.replace(
                                                ":userId",
                                                post.author_id
                                            )
                                        )
                                    }
                                    className="font-semibold text-gray-900 hover:text-kidemia-primary transition-colors truncate"
                                >
                                    {post.author?.full_name || "Unknown"}
                                </button>
                                {userData?.reputation_meta.total_points !== undefined &&
                                    userData.reputation_meta.total_points > 0 && (
                                        <span className="px-2 py-0.5 bg-kidemia-primary/10 text-kidemia-primary text-xs font-medium rounded-full flex-shrink-0">
                                            {formatNumber(
                                                userData.reputation_meta.total_points
                                            )}{" "}
                                            pts
                                        </span>
                                    )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-0.5">
                                <span>{formatTimeAgo(post.created_at)}</span>
                                {post.subject_id && (
                                    <>
                                        <span>•</span>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    SidebarRoutes.subjectPage.replace(
                                                        ":subjectId",
                                                        post.subject_id!
                                                    )
                                                )
                                            }
                                            className="hover:text-kidemia-primary transition-colors truncate"
                                        >
                                            {post.subject_id}
                                        </button>
                                    </>
                                )}
                                {post.exam_target && (
                                    <>
                                        <span>•</span>
                                        <span className="truncate">
                                            {post.exam_target}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        {post.is_pinned && (
                            <div className="p-1.5 bg-kidemia-primary/10 rounded-lg">
                                <Pin className="w-4 h-4 text-kidemia-primary" />
                            </div>
                        )}
                        {post.is_locked && (
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                                <Lock className="w-4 h-4 text-gray-500" />
                            </div>
                        )}
                        {post.is_answered && (
                            <div className="p-1.5 bg-green-100 rounded-lg">
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
                        <span className="mr-1.5">
                            {getPostTypeIcon(post.post_type)}
                        </span>
                        {getPostTypeLabel(post.post_type)}
                    </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {post.title}
                </h1>

                <div className="prose prose-sm sm:prose max-w-none mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1.5">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">
                                {formatNumber(post.view_count)}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-medium">
                                {formatNumber(post.reply_count)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleReaction}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${liked
                                    ? "bg-kidemia-primary text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{formatNumber(likeCount)}</span>
                        </button>

                        <button
                            onClick={handleBookmark}
                            className={`p-2 rounded-lg transition-all
                                ${bookmarked
                                    ? "bg-kidemia-secondary text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <Bookmark className="w-4 h-4" />
                        </button>

                        {user && (
                            <button
                                onClick={handleFollow}
                                className={`p-2 rounded-lg transition-all
                                    ${following
                                        ? "bg-blue-500 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {following ? (
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
