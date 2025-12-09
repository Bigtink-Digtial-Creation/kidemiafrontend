export default function SettingRow({
    icon,
    title,
    description,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-6 py-4 border-b border-gray-200 last:border-none">
            <div className="flex items-start gap-4">
                <div className="text-kidemia-secondary mt-1">
                    {icon}
                </div>
                <div>
                    <h4 className="font-medium text-kidemia-black">
                        {title}
                    </h4>
                    <p className="text-sm text-kidemia-grey">
                        {description}
                    </p>
                </div>
            </div>

            <div className="shrink-0">
                {action}
            </div>
        </div>
    );
}