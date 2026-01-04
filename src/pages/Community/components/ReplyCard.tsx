import { useNavigate } from "react-router";
import type {
    PostDetailResponse,
    ReplyResponse,
} from "../../../sdk/generated";
import {
    useToggleReplyReaction,
    useUserProfile,
} from "../hooks/useCommunity";
import { AuthRoutes, SidebarRoutes } from "../../../routes";
import {
    formatNumber,
    formatTimeAgo,
    getAvatarColor,
    getInitials,
} from "../utils/community.utils";
import {
    ArrowBigUp,
    CheckCircle,
    Edit,
    MoreVertical,
    Trash2,
} from "lucide-react";
import { useState } from "react";

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
    onReplyToReply: (
        parentReplyId: string,
        content: string
    ) => void;
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
    onReplyToReply,
}: ReplyCardProps) {
    const navigate = useNavigate();
    const toggleReaction = useToggleReplyReaction(reply.id);

    const isReplyAuthor = user && reply.author_id === user.id;
    const isEditing = editingReplyId === reply.id;

    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState("");


    const [liked, setLiked] = useState(reply.user_has_upvoted);
    const [likeCount, setLikeCount] = useState(reply.upvote_count);


    const collapseKey = `collapsed_replies:${user?.id}:${post.id}`;
    const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => {
        try {
            return new Set(
                JSON.parse(localStorage.getItem(collapseKey) || "[]")
            );
        } catch {
            return new Set();
        }
    });

    const isCollapsed = collapsedIds.has(reply.id);

    const toggleCollapse = () => {
        const next = new Set(collapsedIds);
        next.has(reply.id) ? next.delete(reply.id) : next.add(reply.id);
        setCollapsedIds(next);
        localStorage.setItem(collapseKey, JSON.stringify([...next]));
    };


    const handleReaction = async () => {
        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }

        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

        try {
            await toggleReaction.mutateAsync({
                replyId: reply.id!,
                reactionType: { reaction_type: "like" },
            });
        } catch {
            // rollback
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        }
    };

    const { data: replyAuthorData } = useUserProfile(
        reply.author_id!
    );

    const handleSubmitReply = () => {
        if (!replyContent.trim()) return;
        onReplyToReply(replyContent, reply.id);
        setReplyContent("");
        setShowReplyBox(false);
    };

    return (
        <div
            className={`${reply.is_accepted_answer
                ? "border-green-300 bg-green-50/50"
                : "border-gray-200"
                } p-4 sm:p-5`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {reply.author?.profile_picture_url ? (
                        <img
                            src={reply.author.profile_picture_url}
                            alt={reply.author.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(
                                reply.author?.full_name || ""
                            )}`}
                        >
                            {getInitials(
                                reply.author?.full_name || "?"
                            )}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() =>
                                    navigate(
                                        SidebarRoutes.userProfile.replace(
                                            ":userId",
                                            reply.author_id
                                        )
                                    )
                                }
                                className="font-semibold text-gray-900 hover:text-kidemia-primary truncate"
                            >
                                {reply.author?.full_name || "Anonymous"}
                            </button>

                            {replyAuthorData?.reputation_meta?.total_points !==
                                undefined &&
                                replyAuthorData.reputation_meta.total_points >
                                0 && (
                                    <span className="text-xs text-gray-500">
                                        {formatNumber(
                                            replyAuthorData.reputation_meta
                                                .total_points
                                        )}{" "}
                                        pts
                                    </span>
                                )}
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>
                                {formatTimeAgo(reply.created_at)}
                            </span>
                            {reply.is_edited && (
                                <span>• Edited</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 ml-3">
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
                                        showMenuForReply === reply.id
                                            ? null
                                            : reply.id
                                    )
                                }
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {showMenuForReply === reply.id && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() =>
                                            setShowMenuForReply(null)
                                        }
                                    />
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border py-1 z-20">
                                        {isReplyAuthor && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingReplyId(reply.id);
                                                        setEditContent(reply.content);
                                                        setShowMenuForReply(null);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100"
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

            {isEditing ? (
                <textarea
                    value={editContent}
                    onChange={(e) =>
                        setEditContent(e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg resize-none mb-3"
                />
            ) : (
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {reply.content}
                </p>
            )}

            <div className="flex items-center space-x-4">
                <button
                    onClick={handleReaction}
                    disabled={toggleReaction.isPending}
                    className={`flex items-center space-x-1 px-1 py-1.5 rounded-lg text-sm ${liked
                        ? "bg-kidemia-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <ArrowBigUp className="w-4 h-4" />
                    <span>{formatNumber(likeCount)}</span>
                </button>

                {/* SAMUEL KUFRE - THere is a problem with child replies */}
                {user && (
                    <button
                        onClick={() => setShowReplyBox((v) => !v)}
                        className="hidden text-sm text-gray-600 hover:text-kidemia-primary"
                    >
                        Reply
                    </button>
                )}

                {reply.child_replies && reply.child_replies.length > 0 && (
                    <button
                        onClick={toggleCollapse}
                        className="text-xs text-gray-500 hover:text-kidemia-primary"
                    >
                        {isCollapsed
                            ? `Show ${reply.child_replies.length} replies`
                            : "Hide replies"}
                    </button>
                )}
            </div>

            {showReplyBox && (
                <div className="mt-3">
                    <textarea
                        value={replyContent}
                        onChange={(e) =>
                            setReplyContent(e.target.value)
                        }
                        rows={3}
                        placeholder="Write a reply…"
                        className="w-full px-3 py-2 border rounded-lg resize-none"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={() => {
                                setShowReplyBox(false);
                                setReplyContent("");
                            }}
                            className="text-sm text-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitReply}
                            className="px-3 py-1.5 bg-kidemia-primary text-white rounded-lg text-sm"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            )}

            {!isCollapsed &&
                reply.child_replies &&
                reply.child_replies.length > 0 && (
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
                                onReplyToReply={onReplyToReply}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
}
