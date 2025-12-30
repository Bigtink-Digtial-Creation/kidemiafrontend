export function PostCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 animate-pulse">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
            </div>

            {/* Badge */}
            <div className="h-6 bg-gray-200 rounded-full w-24 mb-2" />

            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />

            {/* Content */}
            <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Tags */}
            <div className="flex space-x-2 mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-16" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
                <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
                <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-16" />
                    <div className="h-8 bg-gray-200 rounded w-8" />
                </div>
            </div>
        </div>
    );
}




