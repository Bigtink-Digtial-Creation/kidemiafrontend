import { useParams as useParamsSubject, useNavigate as useNavigateSubject } from "react-router";
import { useSubjectFeed } from "../hooks/useCommunity";
import { ArrowLeft as ArrowLeftSubject, BookOpen, Users } from "lucide-react";
import PostCard from "../components/PostCard";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import { ErrorState as ErrorStateSubject } from "../components/ErrorState";
import { EmptyState as EmptyStateSubject } from "../components/EmptyState";

import { useInView as useInViewSubject } from "react-intersection-observer";
import { useEffect as useEffectSubject } from "react";
import { SidebarRoutes } from "../../../routes";

export function SubjectPage() {
    const { subjectId } = useParamsSubject<{ subjectId: string }>();
    const navigate = useNavigateSubject();
    const { ref, inView } = useInViewSubject();

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSubjectFeed(subjectId!, 20);

    // Infinite scroll
    useEffectSubject(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
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
                        <ArrowLeftSubject className="w-4 h-4 mr-2" />
                        Back to Community
                    </button>
                    <ErrorStateSubject error={error} />
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
                        <ArrowLeftSubject className="w-4 h-4 mr-2" />
                        Back to Community
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-kidemia-primary/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-kidemia-primary" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {subjectId}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Discussions and questions about {subjectId}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>{allPosts.length} posts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {allPosts.length === 0 ? (
                    <EmptyStateSubject feedType="subjects" />
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