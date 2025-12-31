import { useEffect, useRef } from "react";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";
import { useDiscoverFeed } from "../hooks/useCommunity";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import type { FeedType } from "../types/community.types";

interface FeedListProps {
    feedType: FeedType;
}

export default function FeedList({ feedType }: FeedListProps) {
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useDiscoverFeed(feedType);

    const observerTarget = useRef<HTMLDivElement>(null);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Initial loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Error state
    if (isError) {
        return <ErrorState error={error} />;
    }

    // Get all posts from all pages
    const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

    // Empty state
    if (allPosts.length === 0) {
        return <EmptyState feedType={feedType} />;
    }

    return (
        <div className="space-y-3">
            {/* Posts */}
            {allPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            {/* Loading indicator for next page */}
            {isFetchingNextPage && (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-kidemia-primary animate-spin" />
                </div>
            )}

            {/* Intersection observer target */}
            <div ref={observerTarget} className="h-4" />

            {/* End of feed message */}
            {!hasNextPage && allPosts.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">You've reached the end! 🎉</p>
                </div>
            )}
        </div>
    );
}