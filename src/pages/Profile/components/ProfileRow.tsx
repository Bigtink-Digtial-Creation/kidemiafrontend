import { Button, Chip } from "@heroui/react";
import { type ReactNode, useState } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

interface ProfileRowProps {
    label: string;
    value?: string | null;
    children?: ReactNode;
    disabled?: boolean;
    status?: "pending" | "approved" | "rejected";
    isUpdating?: boolean;
    onUpdate?: () => void;
    helperText?: string;
}

export default function ProfileRow({
    label,
    value,
    children,
    disabled = false,
    status,
    isUpdating = false,
    onUpdate,
    helperText,
}: ProfileRowProps) {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate();
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const getStatusChip = () => {
        if (!status || status === "approved") return null;

        const statusConfig = {
            pending: { color: "warning" as const, label: "Pending Approval" },
            rejected: { color: "danger" as const, label: "Rejected" },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        if (!config) return null;

        return (
            <Chip size="sm" color={config.color} variant="flat" className="ml-2">
                {config.label}
            </Chip>
        );
    };

    return (
        <div className="py-3 border-b border-gray-200/60 last:border-0">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <label className="text-sm font-medium text-gray-700">
                            {label}
                        </label>
                        {getStatusChip()}
                    </div>

                    {isEditing && children ? (
                        <div className="space-y-2">
                            {children}
                            {helperText && (
                                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className={`text-sm ${disabled ? "text-gray-500" : "text-gray-900"}`}>
                                {value || "-"}
                            </p>
                            {helperText && (
                                <p className="text-xs text-blue-500 italic mt-1">{helperText}</p>
                            )}
                        </>
                    )}
                </div>

                {!disabled && (
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Button size="sm" color="success" variant="flat" isIconOnly onPress={handleUpdate} isLoading={isUpdating} className="min-w-8 h-8">
                                    {!isUpdating && <FiCheck className="text-lg" />}
                                </Button>
                                <Button size="sm" color="danger" variant="flat" isIconOnly onPress={handleCancel} isDisabled={isUpdating} className="min-w-8 h-8">
                                    <FiX className="text-lg" />
                                </Button>
                            </>
                        ) : (
                            children && status !== "pending" && (
                                <Button size="sm" color="default" variant="flat" isIconOnly onPress={() => setIsEditing(true)} className="min-w-8 h-8">
                                    <FiEdit2 className="text-sm" />
                                </Button>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}