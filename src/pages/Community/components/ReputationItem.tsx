interface ReputationItemProps {
    label: string;
    value: number;
    points: number;
    description: string;
}

export default function ReputationItem({ label, value, points, description }: ReputationItemProps) {
    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-lg font-bold text-gray-900">{value}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{description}</span>
                <span className="font-semibold text-kidemia-primary">+{points} pts</span>
            </div>
        </div>
    );
}