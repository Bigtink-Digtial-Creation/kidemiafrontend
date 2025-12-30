import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";
import type { FeedType } from "../types/community.types";
import ErrorBoundary from "../components/ErrorBoundary";
import FeedList from "../components/FeedList";
import Sidebar from "../components/Sidebar";

import FeedTabs from "../components/FeedTabs";
import CreatePostModal from "../components/Modal/CreatePostModal";

export default function CommunityPage() {
    const storedUser = useAtomValue(loggedinUserAtom);
    const user = storedUser?.user;
    const [selectedFeed, setSelectedFeed] = useState<FeedType>("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Title */}
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-kidemia-primary rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">Community</h1>
                                    <p className="text-xs text-gray-500">Learn together, grow together</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center px-4 py-1 bg-kidemia-primary text-white rounded-lg hover:bg-kidemia-primary/90 transition-colors font-medium shadow-sm"
                            >
                                <Plus className="w-3 h-3 mr-2" />
                                <span className="hidden sm:inline">New Post</span>
                                <span className="sm:hidden">Post</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Main Feed */}
                        <div className="lg:col-span-8">
                            {/* Feed Tabs */}
                            <FeedTabs
                                selectedFeed={selectedFeed}
                                onFeedChange={setSelectedFeed}
                                isAuthenticated={!!user}
                            />

                            {/* Feed List */}
                            <div className="mt-4">
                                <FeedList feedType={selectedFeed} />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="hidden lg:block lg:col-span-4">
                            <div className="sticky top-20 space-y-4">
                                <Sidebar />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Post Modal */}
                <CreatePostModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            </div>
        </ErrorBoundary>
    );
}