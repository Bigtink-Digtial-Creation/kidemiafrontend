import { useEffect, useState } from "react";
import type { PostType } from "../../../../sdk/generated";
import { useCreatePost, useTags } from "../../hooks/useCommunity";
import { getPostTypeIcon, validatePostContent, validatePostTitle } from "../../utils/community.utils";
import { addToast } from "@heroui/react";
import { AlertCircle, Info, Loader2, X } from "lucide-react";
import { POST_TYPES } from "../../types/community.types";
interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState<PostType>('discussion');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    const createPost = useCreatePost();
    const { data: availableTags } = useTags();

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setContent("");
            setPostType('discussion');
            setSelectedTags([]);
            setTagInput("");
            setErrors({});
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const titleError = validatePostTitle(title);
        const contentError = validatePostContent(content);

        if (titleError || contentError) {
            setErrors({
                title: titleError || undefined,
                content: contentError || undefined,
            });
            return;
        }

        try {
            await createPost.mutateAsync({
                title,
                content,
                post_type: postType,
                tag_names: selectedTags,
            });

            addToast({
                color: "success", description: "Post created successfully!",
                timeout: 6000,
            });
            onClose();
        } catch (error: any) {
            addToast({
                color: "danger", description: error?.body?.detail || "Failed to create post",
                timeout: 6000,
            });

        }
    };

    const handleAddTag = (tagName: string) => {
        const normalizedTag = tagName.toLowerCase().trim();
        if (normalizedTag && !selectedTags.includes(normalizedTag) && selectedTags.length < 5) {
            setSelectedTags([...selectedTags, normalizedTag]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag(tagInput);
        }
    };

    const filteredTags = availableTags?.filter(
        (tag: any) =>
            tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
            !selectedTags.includes(tag.name)
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Create a Post</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* Post Type Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Object.values(POST_TYPES).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setPostType(type)}
                                        className={`flex items-center justify-center space-x-2 px-4 py-3 
                                            rounded-lg border-2 transition-all
                                            ${postType === type ? "border-kidemia-primary bg-kidemia-primary/5 text-kidemia-primary"
                                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                                            } `} >
                                        <span>{getPostTypeIcon(type)}</span>
                                        <span className="text-sm font-medium capitalize">
                                            {type.replace("_", " ")}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title Input */}
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors({ ...errors, title: undefined });
                                }}
                                placeholder="What's your question or topic?"
                                className={`
                  w-full px-4 py-3 rounded-lg border transition-colors
                  ${errors.title
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-kidemia-primary focus:ring-kidemia-primary"
                                    }
                  focus:outline-none focus:ring-2
                `}
                                maxLength={500}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.title}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">{title.length}/500 characters</p>
                        </div>

                        {/* Content Input */}
                        <div className="mb-6">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    if (errors.content) setErrors({ ...errors, content: undefined });
                                }}
                                placeholder="Share more details..."
                                rows={8}
                                className={`
                  w-full px-4 py-3 rounded-lg border transition-colors resize-none
                  ${errors.content
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-kidemia-primary focus:ring-kidemia-primary"
                                    }
                  focus:outline-none focus:ring-2
                `}
                                maxLength={10000}
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.content}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">{content.length}/10,000 characters</p>
                        </div>

                        {/* Tags Input */}
                        <div className="mb-6">
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (max 5)
                            </label>

                            {/* Selected Tags */}
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-kidemia-primary/10 text-kidemia-primary"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1.5 hover:text-kidemia-primary/70"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Tag Input */}
                            {selectedTags.length < 5 && (
                                <div className="relative">
                                    <input
                                        id="tags"
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagInputKeyDown}
                                        placeholder="Type a tag and press Enter"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-kidemia-primary focus:ring-2 focus:ring-kidemia-primary focus:outline-none transition-colors"
                                    />

                                    {/* Tag Suggestions */}
                                    {tagInput && filteredTags && filteredTags.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {filteredTags.slice(0, 10).map((tag: any) => (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => handleAddTag(tag.name)}
                                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                                                >
                                                    <span className="text-sm">#{tag.name}</span>
                                                    <span className="text-xs text-gray-500">{tag.usage_count} posts</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <p className="mt-1 text-xs text-gray-500 flex items-center">
                                <Info className="w-3 h-3 mr-1" />
                                Tags help others find your post. Press Enter to add a tag.
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> Be specific and clear in your title. Add relevant tags to help
                                others find your post. Follow our community guidelines to ensure your post is helpful
                                and respectful.
                            </p>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            disabled={createPost.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={createPost.isPending}
                            className="inline-flex items-center px-6 py-1 bg-kidemia-primary text-white rounded-lg hover:bg-kidemia-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createPost.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Post"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}