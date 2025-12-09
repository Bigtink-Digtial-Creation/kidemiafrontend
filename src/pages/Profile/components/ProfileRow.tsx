import { Button, Spinner } from "@heroui/react";
import type { ReactNode } from "react";

type Props = {
    label: string;
    value?: string | null;
    disabled?: boolean;
    status?: "pending";
    isUpdating?: boolean;
    onUpdate?: () => void;
    children?: ReactNode;
};

export default function ProfileRow({
    label,
    value,
    disabled,
    status,
    isUpdating,
    onUpdate,
    children,
}: Props) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 hover:bg-gray-100/50 rounded-lg p-2 -mx-2">
            <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                {children ? (
                    <div className="mt-1">{children}</div>
                ) : (
                    <p className="font-medium text-gray-800">{value}</p>
                )}
                {status === "pending" && (
                    <span className="text-xs text-orange-500 font-medium animate-pulse">
                        Pending
                    </span>
                )}
            </div>

            {!disabled && onUpdate && (
                <Button
                    size="sm"
                    variant="light"
                    onPress={onUpdate}
                    isDisabled={isUpdating}
                    className="hidden sm:flex w-full sm:w-auto bg-kidemia-secondary text-white px-6 py-2 rounded-md text-sm transition-all duration-200 hover:bg-kidemia-secondary/90 hover:shadow-md active:scale-95"
                >
                    {isUpdating && <Spinner size="sm" />}
                    {isUpdating ? "Saving..." : "Update"}
                </Button>
            )}
        </div>
    );
}