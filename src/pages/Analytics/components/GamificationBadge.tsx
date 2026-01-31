

export default function GamificationBadge({ icon, label, value }: any) {
    return (
        <div className="bg-kidemia-primary backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-bold text-white leading-none mb-1">{label}</p>
                <p className="text-sm font-bold leading-none">{value}</p>
            </div>
        </div>
    );
}