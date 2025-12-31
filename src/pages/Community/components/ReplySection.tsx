import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateReply, useUpdateReply, useDeleteReply, useAcceptAnswer } from "../hooks/useCommunity";
import { MessageCircle, Send, AlertCircle } from "lucide-react";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";
import DeleteConfirmModal from "../components/Modal/DeleteConfirmModal";
import { type PostDetailResponse } from "../../../sdk/generated";
import { addToast } from "@heroui/react";
import ReplyCard from "../components/ReplyCard"
import { AuthRoutes } from "../../../routes";


interface ReplySectionProps {
    post: PostDetailResponse;
}

export default function ReplySection({ post }: ReplySectionProps) {
    const storedUser = useAtomValue(loggedinUserAtom);
    const user = storedUser?.user;
    const navigate = useNavigate();

    const [replyContent, setReplyContent] = useState("");
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [_, setReplyingToId] = useState<string | null>(null);
    const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
    const [showMenuForReply, setShowMenuForReply] = useState<string | null>(null);

    const createReply = useCreateReply(post.id);
    const updateReply = useUpdateReply(post.id, editingReplyId || "");
    const deleteReply = useDeleteReply(deletingReplyId || "");
    const acceptAnswer = useAcceptAnswer(post.id);

    const handleCreateReply = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault();

        if (!user) {
            navigate(AuthRoutes.login);
            return;
        }

        const content = parentId ? replyContent : replyContent;
        if (!content.trim()) {
            addToast({ color: "warning", description: "Reply cannot be empty" })
            return;
        }

        try {
            await createReply.mutateAsync({
                content: content.trim(),
                parent_reply_id: parentId,
            });

            setReplyContent("");
            setReplyingToId(null);
            addToast({ color: 'danger', description: "Failed to delete post" })
        } catch (error: any) {
            addToast({ color: "danger", description: error?.detail || "Failed to post reply" })
        }
    };

    const handleUpdateReply = async () => {
        if (!editContent.trim()) {
            addToast({ color: "warning", description: "Reply cannot be empty" })
            return;
        }

        try {
            await updateReply.mutateAsync({ "content": editContent.trim() });
            setEditingReplyId(null);
            setEditContent("");
            addToast({ color: "success", description: "Reply updated" })
        } catch (error: any) {
            addToast({ color: "danger", description: error?.detail || "Failed to update reply" })
        }
    };

    const handleDeleteReply = async (replyId: string) => {
        try {
            await deleteReply.mutateAsync(replyId);
            setDeletingReplyId(null);
            addToast({ color: "success", description: "Reply deleted" })
        } catch (error: any) {
            addToast({ color: "danger", description: error?.detail || "Failed to delete reply" })
        }
    };

    const handleAcceptAnswer = async (replyId: string) => {
        try {
            await acceptAnswer.mutateAsync(replyId);
            addToast({ color: "success", description: "Answer accepted" })
        } catch (error: any) {
            addToast({ color: "danger", description: error?.response?.data?.detail || "Failed to accept answer" });
        }
    };

    const isPostAuthor = user && post.author_id === user.id;
    const sortedReplies = [...(post.replies || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return (
        <div className="space-y-6">
            {/* Reply Count Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                    {post.reply_count} {post.reply_count === 1 ? "Reply" : "Replies"}
                </h2>
            </div>

            {/* Replies List */}
            <div className="space-y-4">
                {sortedReplies.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No replies yet. Be the first to reply!</p>
                    </div>
                ) : (
                    sortedReplies.map((reply) => (
                        <ReplyCard
                            key={reply.id}
                            reply={reply}
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
                    ))
                )}
            </div>
            {/* New Reply Form */}
            {!post.is_locked && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <form onSubmit={(e) => handleCreateReply(e)}>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={
                                user
                                    ? "Write your reply..."
                                    : "Sign in to reply"
                            }
                            disabled={!user}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kidemia-primary focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-500">
                                {replyContent.length}/5000 characters
                            </p>
                            <button
                                type="submit"
                                disabled={!user || !replyContent.trim() || createReply.isPending}
                                className="inline-flex items-center px-4 py-2 bg-kidemia-primary text-white rounded-lg hover:bg-kidemia-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {createReply.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Post Reply
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Locked Message */}
            {post.is_locked && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-yellow-800">
                            This post is locked
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                            No new replies can be added to this post.
                        </p>
                    </div>
                </div>
            )}



            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={!!deletingReplyId}
                onClose={() => setDeletingReplyId(null)}
                onConfirm={() => deletingReplyId && handleDeleteReply(deletingReplyId)}
                title="Delete Reply"
                message="Are you sure you want to delete this reply? This action cannot be undone."
                isLoading={deleteReply.isPending}
            />
        </div>
    );
}

