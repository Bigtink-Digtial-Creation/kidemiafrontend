import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Award,
    MessageCircle,
    ThumbsUp,
    CheckCircle,
    Mail,
    Edit
} from "lucide-react";
import {
    formatTimeAgo,
    formatNumber,
    getInitials,
    getAvatarColor,
} from "../utils/community.utils";
import PostCard from "../components/PostCard";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import { ErrorState } from "../components/ErrorState";
import { useInView } from "react-intersection-observer";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";
import { useUserActivityFeed, useUserProfile } from "../hooks/useCommunity";
import ReputationItem from "../components/ReputationItem";
import { SidebarRoutes } from "../../../routes";

type TabType = "posts" | "replies" | "reputation";

export default function UserProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const storedUser = useAtomValue(loggedinUserAtom);
    const currentUser = storedUser?.user;

    const [activeTab, setActiveTab] = useState<TabType>("posts");
    const { ref } = useInView();

    // Fetch user's posts

    const { data: postsData,
        isLoading: isLoadingPosts,
        fetchNextPage: _,
        hasNextPage: hasNextPosts,
        isFetchingNextPage: isFetchingNextPosts, } = useUserActivityFeed(userId!, 20);

    const { data: userData,
        isLoading: isLoadingUser,
        isError: isErrorUser,
        error: errorUser, } = useUserProfile(userId!);


    const isOwnProfile = currentUser && currentUser.id === userId;

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-32 bg-gray-200 rounded" />
                        <div className="bg-white rounded-lg p-6 space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-6 w-48 bg-gray-200 rounded" />
                                    <div className="h-4 w-64 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isErrorUser || !userData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate(SidebarRoutes.community)}
                        className="inline-flex items-center text-kidemia-primary hover:text-kidemia-primary/80 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Community
                    </button>
                    <ErrorState error={errorUser} />
                </div>
            </div>
        );
    }

    const user = userData.user;
    const stats = userData.stats;
    const allPosts = postsData?.pages.flatMap((page) => page.posts) ?? [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate(SidebarRoutes.community)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Community
                    </button>

                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Avatar */}
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div
                                className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg ${getAvatarColor(
                                    user.full_name
                                )}`}
                            >
                                {getInitials(user.full_name)}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    {user.full_name}
                                </h1>
                                {user.reputation_points !== undefined && user.reputation_points > 0 && (
                                    <span className="px-2 py-1 bg-kidemia-primary/10 text-kidemia-primary text-sm font-semibold rounded-sm">
                                        {formatNumber(user.reputation_points)} pts
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                {user.email && (
                                    <div className="flex items-center space-x-1">
                                        <Mail className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                                {user.created_at && (
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Joined {formatTimeAgo(user.created_at)}</span>
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                            </div>

                            {user.bio && (
                                <p className="mt-3 text-gray-700 max-w-2xl">{user.bio}</p>
                            )}
                        </div>

                        {/* Edit Profile Button */}
                        {isOwnProfile && (
                            <button
                                onClick={() => navigate(SidebarRoutes.profile)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <StatCard
                            icon={<MessageCircle className="w-5 h-5" />}
                            label="Posts"
                            value={formatNumber(stats.posts_created)}
                            color="bg-blue-100 text-blue-600"
                        />
                        <StatCard
                            icon={<ThumbsUp className="w-5 h-5" />}
                            label="Replies"
                            value={formatNumber(stats.replies_created)}
                            color="bg-green-100 text-green-600"
                        />
                        <StatCard
                            icon={<CheckCircle className="w-5 h-5" />}
                            label="Accepted"
                            value={formatNumber(stats.answers_accepted)}
                            color="bg-purple-100 text-purple-600"
                        />
                        <StatCard
                            icon={<Award className="w-5 h-5" />}
                            label="Helpful Votes"
                            value={formatNumber(stats.helpful_votes_received)}
                            color="bg-orange-100 text-orange-600"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <TabButton
                            active={activeTab === "posts"}
                            onClick={() => setActiveTab("posts")}
                            icon={<MessageCircle className="w-4 h-4" />}
                            label="Posts"
                            count={stats.posts_created}
                        />
                        <TabButton
                            active={activeTab === "replies"}
                            onClick={() => setActiveTab("replies")}
                            icon={<ThumbsUp className="w-4 h-4" />}
                            label="Replies"
                            count={stats.replies_created}
                        />
                        <TabButton
                            active={activeTab === "reputation"}
                            onClick={() => setActiveTab("reputation")}
                            icon={<Award className="w-4 h-4" />}
                            label="Reputation"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === "posts" && (
                    <div className="space-y-4">
                        {isLoadingPosts ? (
                            <>
                                <PostCardSkeleton />
                                <PostCardSkeleton />
                                <PostCardSkeleton />
                            </>
                        ) : allPosts.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">
                                    {isOwnProfile ? "You haven't created any posts yet" : "No posts yet"}
                                </p>
                            </div>
                        ) : (
                            <>
                                {allPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}

                                {/* Loading indicator */}
                                {isFetchingNextPosts && (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-kidemia-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                {/* Intersection observer target */}
                                <div ref={ref} className="h-4" />

                                {/* End message */}
                                {!hasNextPosts && allPosts.length > 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm">You've reached the end! 🎉</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === "replies" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <ThumbsUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Reply history coming soon</p>
                    </div>
                )}

                {activeTab === "reputation" && (
                    <div className="space-y-6">
                        {isLoadingUser ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ) : userData ? (
                            <>
                                {/* Reputation Overview */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">Reputation</h2>
                                        <div className="text-3xl font-bold text-kidemia-primary">
                                            {formatNumber(userData.user.reputation_points)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <ReputationItem
                                            label="Posts Created"
                                            value={userData.stats.posts_created}
                                            points={userData.stats.posts_created * 5}
                                            description="+5 points per post"
                                        />
                                        <ReputationItem
                                            label="Replies Created"
                                            value={userData.stats.replies_created}
                                            points={userData.stats.replies_created * 2}
                                            description="+2 points per reply"
                                        />
                                        <ReputationItem
                                            label="Answers Accepted"
                                            value={userData.stats.answers_accepted}
                                            points={userData.stats.answers_accepted * 15}
                                            description="+15 points per accepted answer"
                                        />
                                        <ReputationItem
                                            label="Helpful Votes"
                                            value={userData.stats.helpful_votes_received}
                                            points={userData.stats.helpful_votes_received * 1}
                                            description="+1 point per vote"
                                        />
                                    </div>
                                </div>

                                {/* Badges */}
                                {userData.reputation_meta.badges && userData.reputation_meta.badges.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
                                        <div className="flex flex-wrap gap-3">
                                            {userData.reputation_meta.badges.map((badge) => (
                                                <div
                                                    key={badge}
                                                    className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium"
                                                >
                                                    <Award className="w-4 h-4 mr-2" />
                                                    {badge.replace(/_/g, " ")}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reputation Level */}
                                <div className="bg-gradient-to-br from-kidemia-primary to-kidemia-secondary rounded-lg shadow-sm p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">
                                                {userData.reputation_meta.level}
                                            </h3>
                                            <p className="text-white/80 text-sm">
                                                {getReputationDescription(userData.reputation_meta.total_points)}
                                            </p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <Award className="w-8 h-8" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Components
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
        </div>
    );
}

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    count?: number;
}

function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
        flex items-center space-x-2 py-4 border-b-2 transition-colors font-medium
        ${active
                    ? "border-kidemia-primary text-kidemia-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }
      `}
        >
            {icon}
            <span>{label}</span>
            {count !== undefined && (
                <span
                    className={`
          px-2 py-0.5 rounded-full text-xs
          ${active ? "bg-kidemia-primary/10" : "bg-gray-100"}
        `}
                >
                    {count}
                </span>
            )}
        </button>
    );
}





function getReputationDescription(points: number): string {
    if (points >= 1000) return "Top contributor in the community";
    if (points >= 500) return "Recognized expert in your field";
    if (points >= 200) return "Active community member";
    if (points >= 50) return "Growing your presence";
    return "Getting started in the community";
}