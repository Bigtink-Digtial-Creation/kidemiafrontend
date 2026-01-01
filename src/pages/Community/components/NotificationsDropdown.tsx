import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    useNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
} from "../hooks/useCommunity";
import { Bell, Check, CheckCheck, Loader2, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import { formatTimeAgo } from "../utils/community.utils";
import { addToast } from "@heroui/react";
import { SidebarRoutes } from "../../../routes";


export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: notifications, isLoading } = useNotifications(showUnreadOnly);
    const markAsRead = useMarkNotificationRead();
    const markAllAsRead = useMarkAllNotificationsRead();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

    const handleNotificationClick = async (notification: any) => {
        // Mark as read
        if (!notification.is_read) {
            await markAsRead.mutateAsync(notification.id);
        }

        // Navigate to the relevant page
        if (notification.post_id) {
            navigate(SidebarRoutes.postPage.replace(":postId", notification.post_id));

            setIsOpen(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead.mutateAsync();
            addToast({
                color: "success", description: "All notifications marked as read",
                timeout: 6000,
            });
        } catch (error) {
            addToast({
                color: "success", description: "Failed to mark notifications as read",
                timeout: 6000,
            });
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "new_reply":
            case "reply":
                return <MessageCircle className="w-4 h-4 text-blue-600" />;
            case "upvote":
            case "reaction":
                return <ThumbsUp className="w-4 h-4 text-green-600" />;
            case "answer_accepted":
                return <Check className="w-4 h-4 text-purple-600" />;
            case "new_follower":
                return <UserPlus className="w-4 h-4 text-orange-600" />;
            default:
                return <Bell className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 sm:right-0 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0
                mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-md bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] 
                overflow-hidden flex flex-col">

                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    disabled={markAllAsRead.isPending}
                                    className="text-sm text-kidemia-primary hover:text-kidemia-primary/80 font-medium disabled:opacity-50"
                                >
                                    <CheckCheck className="w-4 h-4 inline mr-1" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowUnreadOnly(false)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${!showUnreadOnly
                                    ? "bg-kidemia-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setShowUnreadOnly(true)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${showUnreadOnly
                                    ? "bg-kidemia-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Unread ({unreadCount})
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-kidemia-primary animate-spin" />
                            </div>
                        ) : !notifications || notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <Bell className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-gray-500 text-center">
                                    {showUnreadOnly ? "No unread notifications" : "No notifications yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? "bg-blue-50" : ""
                                            }`}
                                    >
                                        <div className="flex space-x-3">
                                            {/* Icon */}
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notification.is_read ? "bg-white" : "bg-gray-100"
                                                    }`}
                                            >
                                                {getNotificationIcon(notification.notification_type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTimeAgo(notification.created_at)}
                                                </p>
                                            </div>

                                            {/* Unread Indicator */}
                                            {!notification.is_read && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications && notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => {
                                    navigate(SidebarRoutes.notificationPage);
                                    setIsOpen(false);
                                }}
                                className="w-full text-center text-sm text-kidemia-primary hover:text-kidemia-primary/80 font-medium"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}