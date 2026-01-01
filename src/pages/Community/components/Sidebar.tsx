/**
 * Kidemia Community - Sidebar Component
 * File: src/components/community/Sidebar.tsx
 */

import { useNavigate } from "react-router";
import {
    useForumStats,
    useTrendingPosts,
    usePopularTags,
    useRecommendedPosts,
} from "../hooks/useCommunity";
import {
    TrendingUp,
    MessageCircle,
    CheckCircle,
    Users,
    Tag,
    Eye,
    ThumbsUp,
    Flame,
    Sparkles,
} from "lucide-react";

import { formatNumber } from "../utils/community.utils";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";
import { SidebarRoutes } from "../../../routes";

export default function Sidebar() {
    const storedUser = useAtomValue(loggedinUserAtom);
    const user = storedUser?.user;
    const navigate = useNavigate();

    const { data: stats } = useForumStats();
    const { data: trending } = useTrendingPosts(5);
    const { data: popularTags } = usePopularTags(10);
    const { data: recommended } = useRecommendedPosts(5);

    return (
        <div className="space-y-4">
            {/* Stats Card */}
            {stats && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-kidemia-primary" />
                        Community Stats
                    </h3>
                    <div className="space-y-2">
                        <StatItem
                            icon={<MessageCircle className="w-4 h-4" />}
                            label="Total Posts"
                            value={formatNumber(stats.total_posts)}
                        />
                        <StatItem
                            icon={<Users className="w-4 h-4" />}
                            label="Total Replies"
                            value={formatNumber(stats.total_replies)}
                        />
                        <StatItem
                            icon={<Flame className="w-4 h-4" />}
                            label="Active Discussions"
                            value={formatNumber(stats.active_discussions)}
                        />
                        <StatItem
                            icon={<CheckCircle className="w-4 h-4" />}
                            label="Answered Questions"
                            value={formatNumber(stats.answered_questions)}
                        />
                    </div>
                </div>
            )}

            {/* Recommended Posts (for authenticated users) */}
            {user && recommended && recommended.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-kidemia-secondary" />
                        Recommended for You
                    </h3>
                    <div className="space-y-3">
                        {recommended.map((post) => (
                            <button
                                key={post.id}
                                onClick={() => navigate(SidebarRoutes.postPage.replace(":postId", post.id))}
                                className="w-full text-left group"
                            >
                                <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-kidemia-primary transition-colors">
                                    {post.title}
                                </p>
                                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center">
                                        <ThumbsUp className="w-3 h-3 mr-1" />
                                        {post.upvote_count}
                                    </span>
                                    <span className="flex items-center">
                                        <MessageCircle className="w-3 h-3 mr-1" />
                                        {post.reply_count}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Trending Posts */}
            {trending && trending.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Flame className="w-4 h-4 mr-2 text-orange-500" />
                        Trending Now
                    </h3>
                    <div className="space-y-3">
                        {trending.map((post, index) => (
                            <button
                                key={post.id}
                                onClick={() => navigate(SidebarRoutes.postPage.replace(":postId", post.id))}
                                className="w-full text-left group"
                            >
                                <div className="flex items-start space-x-2">
                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-kidemia-primary/10 text-kidemia-primary rounded-full text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-kidemia-primary transition-colors">
                                            {post.title}
                                        </p>
                                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center">
                                                <Eye className="w-3 h-3 mr-1" />
                                                {formatNumber(post.view_count)}
                                            </span>
                                            <span className="flex items-center">
                                                <MessageCircle className="w-3 h-3 mr-1" />
                                                {formatNumber(post.reply_count)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Tags */}
            {popularTags && popularTags.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-kidemia-primary" />
                        Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => navigate(SidebarRoutes.tagPage.replace(":tagId", tag.id))}
                                style={{ backgroundColor: tag.color + "20", color: tag.color }}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                            >
                                #{tag.name}
                                <span className="ml-1.5 opacity-75">({formatNumber(tag.usage_count)})</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="bg-gradient-to-br from-kidemia-primary to-kidemia-secondary rounded-lg shadow-sm p-4 text-white">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm mb-3 opacity-90">
                    Browse our community guidelines or ask a question to get started.
                </p>
                <button
                    onClick={() => navigate(SidebarRoutes.communityGuideLines)}
                    className="w-full bg-white text-kidemia-primary px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                >
                    View Guidelines
                </button>
            </div>
        </div>
    );
}

// Stat Item Component
interface StatItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{value}</span>
        </div>
    );
}