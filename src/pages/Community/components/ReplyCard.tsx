import { useNavigate } from "react-router";
import type { PostDetailResponse, ReplyResponse } from "../../../sdk/generated";
import { useToggleReplyReaction } from "../hooks/useCommunity";
import { AuthRoutes } from "../../../routes";
import { formatNumber, formatTimeAgo, getAvatarColor, getInitials } from "../utils/community.utils";
import { CheckCircle, Edit, MoreVertical, ThumbsUp, Trash2 } from "lucide-react";

// Reply Card Component
interface ReplyCardProps {
    reply: ReplyResponse;
    post: PostDetailResponse;
    user: any;
    isPostAuthor: boolean | undefined;
    editingReplyId: string | null;
    editContent: string;
    setEditContent: (content: string) => void;
    setEditingReplyId: (id: string | null) => void;
    handleUpdateReply: (replyId: string) => void;
    setDeletingReplyId: (id: string) => void;
    handleAcceptAnswer: (replyId: string) => void;
    showMenuForReply: string | null;
    setShowMenuForReply: (id: string | null) => void;
    updateReply: any;
    acceptAnswer: any;
}

export default function ReplyCard({
    reply,
    post,
    user,
    isPostAuthor,
    editingReplyId,
    editContent,
    setEditContent,
    setEditingReplyId,
    handleUpdateReply,
    setDeletingReplyId,
    handleAcceptAnswer,
    showMenuForReply,
    setShowMenuForReply,
    updateReply,
    acceptAnswer,
}: ReplyCardProps) {
    const navigate = useNavigate();
    const toggleReaction = useToggleReplyReaction(reply.id);

    const isReplyAuthor = user && reply.author_id === user.id;
    const isEditing = editingReplyId === reply.id;

    const handleReaction = async () => {
        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }
        await toggleReaction.mutateAsync({
            replyId: editingReplyId!,
            reactionType: {
                reaction_type: "like",
            },
        });
    };

    return (
        <div
            className={`bg-white rounded-lg border ${reply.is_accepted_answer
                ? "border-green-300 bg-green-50/50"
                : "border-gray-200"
                } p-4 sm:p-5`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Avatar */}
                    {reply.author?.avatar_url ? (
                        <img
                            src={reply.author.avatar_url}
                            alt={reply.author.full_name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(
                                reply.author?.full_name || ""
                            )}`}
                        >
                            {getInitials(reply.author?.full_name || "?")}
                        </div>
                    )}

                    {/* Author Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate(`/community/user/${reply.author_id}`)}
                                className="font-semibold text-gray-900 hover:text-kidemia-primary transition-colors truncate"
                            >
                                {reply.author?.full_name || "Unknown"}
                            </button>
                            {reply.author?.reputation_points !== undefined &&
                                reply.author.reputation_points! > 0 && (
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                        {formatNumber(reply.author.reputation_points!)} pts
                                    </span>
                                )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatTimeAgo(reply.created_at)}</span>
                            {reply.is_edited && <span>• Edited</span>}
                        </div>
                    </div>
                </div>

                {/* Badges & Menu */}
                <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                    {reply.is_accepted_answer && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            <span>Accepted</span>
                        </div>
                    )}

                    {user && (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowMenuForReply(
                                        showMenuForReply === reply.id ? null : reply.id
                                    )
                                }
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {showMenuForReply === reply.id && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenuForReply(null)}
                                    />
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                        {isReplyAuthor && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingReplyId(reply.id);
                                                        setEditContent(reply.content);
                                                        setShowMenuForReply(null);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Edit className="w-3 h-3 mr-2" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletingReplyId(reply.id);
                                                        setShowMenuForReply(null);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-2" />
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        {isPostAuthor &&
                                            !reply.is_accepted_answer &&
                                            post.post_type === "question" && (
                                                <button
                                                    onClick={() => {
                                                        handleAcceptAnswer(reply.id);
                                                        setShowMenuForReply(null);
                                                    }}
                                                    disabled={acceptAnswer.isPending}
                                                    className="w-full flex items-center px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-2" />
                                                    Accept Answer
                                                </button>
                                            )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            {isEditing ? (
                <div className="mb-3">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kidemia-primary focus:border-transparent resize-none"
                    />
                    <div className="flex items-center justify-end space-x-2 mt-2">
                        <button
                            onClick={() => {
                                setEditingReplyId(null);
                                setEditContent("");
                            }}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleUpdateReply(reply.id)}
                            disabled={updateReply.isPending}
                            className="px-3 py-1.5 bg-kidemia-primary text-white rounded-lg text-sm hover:bg-kidemia-primary/90 disabled:opacity-50"
                        >
                            {updateReply.isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{reply.content}</p>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleReaction}
                    disabled={toggleReaction.isPending}
                    className={`
            flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${reply.user_has_upvoted
                            ? "bg-kidemia-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
            disabled:opacity-50
          `}
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{formatNumber(reply.upvote_count)}</span>
                </button>
            </div>

            {/* Nested Replies */}
            {reply.child_replies && reply.child_replies.length > 0 && (
                <div className="mt-4 ml-4 sm:ml-8 space-y-3 pl-4 border-l-2 border-gray-200">
                    {reply.child_replies.map((childReply) => (
                        <ReplyCard
                            key={childReply.id}
                            reply={childReply}
                            post={post}
                            user={user}
                            isPostAuthor={isPostAuthor}
                            editingReplyId={editingReplyId}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            setEditingReplyId={setEditingReplyId}
                            handleUpdateReply={handleUpdateReply}
                            setDeletingReplyId={setDeletingReplyId}
                            handleAcceptAnswer={handleAcceptAnswer}
                            showMenuForReply={showMenuForReply}
                            setShowMenuForReply={setShowMenuForReply}
                            updateReply={updateReply}
                            acceptAnswer={acceptAnswer}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}