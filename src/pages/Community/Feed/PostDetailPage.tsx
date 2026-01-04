import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    ArrowLeft,
    MoreVertical,
    Edit,
    Trash2,
    Flag,
    Share2,
} from "lucide-react";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";
import { ErrorState } from "../components/ErrorState";
import { addToast } from "@heroui/react";
import { useDeletePost, usePost } from "../hooks/useCommunity";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import ReplySection from "../components/ReplySection";
import EditPostModal from "../components/Modal/EditPostModal";
import DeleteConfirmModal from "../components/Modal/DeleteConfirmModal";
import PostContent from "../components/PostContent";
import { SidebarRoutes } from "../../../routes";


export default function PostDetailPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const storedUser = useAtomValue(loggedinUserAtom);
    const user = storedUser?.user;

    const [showMenu, setShowMenu] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: post, isLoading, isError, error } = usePost(postId!);
    const deletePost = useDeletePost();

    const isAuthor = user && post && user.id === post.author_id;

    const handleDelete = async () => {
        try {
            await deletePost.mutateAsync(postId!);
            addToast({ color: 'success', description: "Post deleted successfully" })
            navigate(SidebarRoutes.community);
        } catch (error: any) {
            addToast({
                color: "danger", description: error?.body?.detail || "Failed to delete post",
                timeout: 6000,
            });
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post?.title,
                    text: post?.content.slice(0, 100),
                    url: url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                addToast({ color: 'success', description: "Link copied to clipboard!" })

            }
        } catch (error) {
            console.error("Share failed:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <PostCardSkeleton />
                </div>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate(SidebarRoutes.community)}
                        className="inline-flex items-center text-kidemia-primary hover:text-kidemia-primary/80 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Community
                    </button>
                    <ErrorState error={error} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(SidebarRoutes.community)}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            <span className="font-medium">Back</span>
                        </button>

                        <div className="flex items-center space-x-2">
                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>

                            {/* More Menu */}
                            {user && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {showMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowMenu(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                                {isAuthor && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setIsEditModalOpen(true);
                                                                setShowMenu(false);
                                                            }}
                                                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Edit className="w-4 h-4 mr-3" />
                                                            Edit Post
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setIsDeleteModalOpen(true);
                                                                setShowMenu(false);
                                                            }}
                                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-3" />
                                                            Delete Post
                                                        </button>
                                                    </>
                                                )}
                                                {!isAuthor && (
                                                    <button
                                                        onClick={() => {
                                                            addToast({ color: "warning", description: "Post reported" });
                                                            setShowMenu(false);
                                                        }}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Flag className="w-4 h-4 mr-3" />
                                                        Report Post
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Post Content */}
                <PostContent post={post} isDetailView={true} />

                {/* Reply Section */}
                <div className="mt-6">
                    <ReplySection post={post} />
                </div>
            </div>

            {/* Modals */}
            {isAuthor && (
                <>
                    <EditPostModal
                        post={post}
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                    <DeleteConfirmModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                        title="Delete Post"
                        message="Are you sure you want to delete this post? This action cannot be undone."
                        isLoading={deletePost.isPending}
                    />
                </>
            )}
        </div>
    );
}