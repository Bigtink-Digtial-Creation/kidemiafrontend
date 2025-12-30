import { Flame, Clock, HelpCircle, TrendingUp, Users, BookOpen } from "lucide-react";
import type { FeedType } from "../types/community.types";

interface FeedTabsProps {
    selectedFeed: FeedType;
    onFeedChange: (feed: FeedType) => void;
    isAuthenticated: boolean;
}

interface Tab {
    id: FeedType;
    label: string;
    icon: React.ReactNode;
    requiresAuth?: boolean;
}

export default function FeedTabs({ selectedFeed, onFeedChange, isAuthenticated }: FeedTabsProps) {
    const tabs: Tab[] = [
        {
            id: "all",
            label: "Recent",
            icon: <Clock className="w-4 h-4" />,
        },
        {
            id: "trending",
            label: "Trending",
            icon: <Flame className="w-4 h-4" />,
        },
        {
            id: "unanswered",
            label: "Unanswered",
            icon: <HelpCircle className="w-4 h-4" />,
        },
        {
            id: "popular",
            label: "Popular",
            icon: <TrendingUp className="w-4 h-4" />,
        },
        {
            id: "following",
            label: "Following",
            icon: <Users className="w-4 h-4" />,
            requiresAuth: true,
        },
        {
            id: "subjects",
            label: "My Subjects",
            icon: <BookOpen className="w-4 h-4" />,
            requiresAuth: true,
        },
    ];

    const visibleTabs = tabs.filter((tab) => !tab.requiresAuth || isAuthenticated);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <div className="flex overflow-x-auto scrollbar-hide space-x-1">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onFeedChange(tab.id)}
                        className={`
              flex items-center space-x-2 px-4 py-2.5 rounded-md font-medium text-sm whitespace-nowrap transition-all
              ${selectedFeed === tab.id
                                ? "bg-kidemia-primary text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }
            `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}