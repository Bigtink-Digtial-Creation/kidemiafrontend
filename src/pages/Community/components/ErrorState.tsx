import { AlertCircle, RefreshCw } from "lucide-react";
import { getHttpErrorMessage } from "../utils/community.utils";

interface ErrorStateProps {
    error: any;
    onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    const statusCode = error?.response?.status;
    const errorMessage = statusCode
        ? getHttpErrorMessage(statusCode)
        : "Unable to load posts. Please check your connection.";

    return (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {statusCode ? `Error ${statusCode}` : "Something went wrong"}
                </h3>
                <p className="mt-2 text-sm text-gray-600 max-w-sm">{errorMessage}</p>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-kidemia-primary text-white rounded-lg hover:bg-kidemia-primary/90 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </button>
                )}

                {statusCode === 401 && (
                    <div className="mt-4">
                        <a
                            href="/login"
                            className="text-sm text-kidemia-primary hover:text-kidemia-primary/80 font-medium"
                        >
                            Sign in to continue
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}