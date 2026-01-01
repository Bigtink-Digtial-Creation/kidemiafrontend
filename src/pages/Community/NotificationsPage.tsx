import { useNavigate } from "react-router";
import {
    useNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
} from "../Community/hooks/useCommunity";
import {
    Bell,
    Check,
    CheckCheck,
    Loader2,
    MessageCircle,
    ThumbsUp,
    UserPlus,
    ArrowLeft,
} from "lucide-react";
import { formatTimeAgo } from "../Community/utils/community.utils";
import { addToast } from "@heroui/react";
import { useState } from "react";
import { SidebarRoutes } from "../../routes";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const { data: notifications, isLoading } = useNotifications(showUnreadOnly);
    const markAsRead = useMarkNotificationRead();
    const markAllAsRead = useMarkAllNotificationsRead();

    const unreadCount =
        notifications?.filter((n) => !n.is_read).length || 0;

    const handleNotificationClick = async (notification: any) => {
        if (!notification.is_read) {
            await markAsRead.mutateAsync(notification.id);
        }

        if (notification.post_id) {
            navigate(
                SidebarRoutes.postPage.replace(
                    ":postId",
                    notification.post_id
                )
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead.mutateAsync();
            addToast({
                color: "success",
                description: "All notifications marked as read",
            });
        } catch {
            addToast({
                color: "danger",
                description: "Failed to mark notifications as read",
            });
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "new_reply":
            case "reply":
                return <MessageCircle className="w-5 h-5 text-blue-600" />;
            case "upvote":
            case "reaction":
                return <ThumbsUp className="w-5 h-5 text-green-600" />;
            case "answer_accepted":
                return <Check className="w-5 h-5 text-purple-600" />;
            case "new_follower":
                return <UserPlus className="w-5 h-5 text-orange-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(SidebarRoutes.community)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Notifications
                    </h1>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsRead.isPending}
                        className="flex items-center gap-1 text-sm font-medium text-kidemia-primary hover:text-kidemia-primary/80"
                    >
                        <CheckCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Mark all read</span>
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setShowUnreadOnly(false)}
                    className={`px-4 py-1.5 text-sm rounded-full font-medium transition
                        ${!showUnreadOnly
                            ? "bg-kidemia-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    All
                </button>

                <button
                    onClick={() => setShowUnreadOnly(true)}
                    className={`px-4 py-1.5 text-sm rounded-full font-medium transition
                        ${showUnreadOnly
                            ? "bg-kidemia-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-kidemia-primary" />
                </div>
            ) : !notifications || notifications.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm">
                        {showUnreadOnly
                            ? "No unread notifications"
                            : "No notifications yet"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <button
                            key={notification.id}
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                            className={`
                                relative w-full text-left px-4 py-4 sm:px-5
                                rounded-xl transition-all
                                hover:bg-gray-50
                                ${!notification.is_read
                                    ? "bg-blue-50/60"
                                    : ""
                                }
                            `}
                        >
                            {!notification.is_read && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-xl" />
                            )}

                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    {getNotificationIcon(
                                        notification.notification_type
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {notification.title}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                        {notification.message}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatTimeAgo(
                                            notification.created_at
                                        )}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
