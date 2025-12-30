/**
 * Kidemia Community/Forum - Utility Functions
 * File: src/utils/community.utils.ts
 */

import type { PostType } from "../../../sdk/generated";




/**
 * Format timestamp as relative time (e.g., "2 hours ago")
 */
export function formatTimeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
}

/**
 * Format number with K, M suffixes
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
}

/**
 * Generate excerpt from content
 */
export function getExcerpt(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;

    const excerpt = content.slice(0, maxLength);
    const lastSpace = excerpt.lastIndexOf(" ");

    if (lastSpace > 0) {
        return excerpt.slice(0, lastSpace) + "...";
    }

    return excerpt + "...";
}

/**
 * Get post type icon
 */
export function getPostTypeIcon(postType?: PostType): string {
    const icons: Record<PostType, string> = {
        ['question']: "❓",
        ['discussion']: "💬",
        ["study_group"]: "👥",
        ["resource_share"]: "📚",
        ['announcement']: "📢",
    };
    if (!postType) {
        return "💬";
    }
    return icons[postType] || "💬";
}

/**
 * Get post type label
 */
export function getPostTypeLabel(postType?: PostType): string {
    const labels: Record<PostType, string> = {
        ["question"]: "Question",
        ["discussion"]: "Discussion",
        ["study_group"]: "Study Group",
        ["resource_share"]: "Resource",
        ["announcement"]: "Announcement",
    };

    if (!postType) {
        return "Announcement";
    }
    return labels[postType] || "Post";
}

/**
 * Get post type color class
 */
export function getPostTypeColor(postType?: PostType): string {
    const colors: Record<PostType, string> = {
        ["question"]: "bg-blue-100 text-blue-800",
        ["discussion"]: "bg-purple-100 text-purple-800",
        ["resource_share"]: "bg-green-100 text-green-800",
        ["study_group"]: "bg-yellow-100 text-yellow-800",
        ["announcement"]: "bg-kidemia-primary/10 text-kidemia-primary",
    };

    if (!postType) {
        return "bg-gray-100 text-gray-800";
    }
    return colors[postType] || "bg-gray-100 text-gray-800";
}

/**
 * Validate post title
 */
export function validatePostTitle(title: string): string | null {
    if (!title || title.trim().length < 5) {
        return "Title must be at least 5 characters long";
    }
    if (title.length > 500) {
        return "Title must not exceed 500 characters";
    }
    return null;
}

/**
 * Validate post content
 */
export function validatePostContent(content: string): string | null {
    if (!content || content.trim().length < 10) {
        return "Content must be at least 10 characters long";
    }
    if (content.length > 10000) {
        return "Content must not exceed 10,000 characters";
    }
    return null;
}

/**
 * Generate avatar initials
 */
export function getInitials(name: string): string {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate avatar color based on name
 */
export function getAvatarColor(name: string): string {
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-teal-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-purple-500",
        "bg-pink-500",
    ];

    const hash = name.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
}

/**
 * Sanitize HTML content (basic)
 */
export function sanitizeContent(content: string): string {
    return content
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "")
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
}

/**
 * Check if user can perform action
 */
export function canPerformAction(
    authorId: string,
    currentUserId: string | undefined
): boolean {
    return !!currentUserId && authorId === currentUserId;
}

/**
 * Get error message from API error
 */
export function getErrorMessage(error: any): string {
    if (error?.response?.data?.detail) {
        return error.response.data.detail;
    }
    if (error?.message) {
        return error.message;
    }
    return "An unexpected error occurred";
}

/**
 * Get HTTP error message
 */
export function getHttpErrorMessage(statusCode: number): string {
    const messages: Record<number, string> = {
        400: "Invalid request. Please check your input.",
        401: "You need to be logged in to perform this action.",
        403: "You don't have permission to perform this action.",
        404: "The content you're looking for doesn't exist.",
        409: "This action conflicts with existing data.",
        422: "The data provided is invalid.",
        429: "Too many requests. Please slow down.",
        500: "Server error. Please try again later.",
        503: "Service temporarily unavailable.",
    };

    return messages[statusCode] || "An error occurred. Please try again.";
}