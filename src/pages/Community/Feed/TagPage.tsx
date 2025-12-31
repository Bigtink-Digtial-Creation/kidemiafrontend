import { useParams, useNavigate } from "react-router";
import { useTagFeed, useTags } from "../hooks/useCommunity";
import { ArrowLeft, Tag, TrendingUp } from "lucide-react";
import PostCard from "../components/PostCard";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { SidebarRoutes } from "../../../routes";

export default function TagPage() {
    const { tagId } = useParams<{ tagId: string }>();
    const navigate = useNavigate();
    const { ref, inView } = useInView();

    const { data: allTags } = useTags();
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useTagFeed(tagId!, 20);

    // Find tag details
    const tag = allTags?.find((t) => t.id === tagId);

    // Infinite scroll
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="h-8 w-32 bg-kidemia-grey rounded mb-6 animate-pulse" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
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
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate(SidebarRoutes.community)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Community
                    </button>

                    {tag && (
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-16 h-16 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: tag.color + "20" }}
                            >
                                <Tag className="w-8 h-8" style={{ color: tag.color || "#0000" }} />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    #{tag.name}
                                </h1>
                                {tag.description && (
                                    <p className="text-gray-600 mt-1">{tag.description}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{tag.usage_count} posts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {allPosts.length === 0 ? (
                    <EmptyState feedType="all" />
                ) : (
                    <div className="space-y-4">
                        {allPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                        {/* Loading indicator */}
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-4 border-kidemia-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {/* Intersection observer target */}
                        <div ref={ref} className="h-4" />

                        {/* End message */}
                        {!hasNextPage && allPosts.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">You've reached the end! 🎉</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

