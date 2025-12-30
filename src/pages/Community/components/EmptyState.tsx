import type { FeedType } from "../types/community.types";
import { FileQuestion, TrendingUp, Users } from "lucide-react";

interface EmptyStateProps {
    feedType: FeedType;
}

export function EmptyState({ feedType }: EmptyStateProps) {
    const messages: Record<FeedType, { icon: React.ReactNode; title: string; description: string }> = {
        all: {
            icon: <FileQuestion className="w-16 h-16 text-gray-400" />,
            title: "No posts yet",
            description: "Be the first to start a discussion!",
        },
        trending: {
            icon: <TrendingUp className="w-16 h-16 text-gray-400" />,
            title: "No trending posts",
            description: "Check back later for trending content",
        },
        unanswered: {
            icon: <FileQuestion className="w-16 h-16 text-gray-400" />,
            title: "All questions answered!",
            description: "Great work helping the community",
        },
        popular: {
            icon: <TrendingUp className="w-16 h-16 text-gray-400" />,
            title: "No popular posts yet",
            description: "Popular posts will appear here",
        },
        following: {
            icon: <Users className="w-16 h-16 text-gray-400" />,
            title: "No posts from followed users",
            description: "Follow users to see their posts here",
        },
        subjects: {
            icon: <FileQuestion className="w-16 h-16 text-gray-400" />,
            title: "No posts in your subjects",
            description: "Posts from your enrolled subjects will appear here",
        },
    };

    const message = messages[feedType];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center text-center">
                {message.icon}
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{message.title}</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">{message.description}</p>
            </div>
        </div>
    );
}