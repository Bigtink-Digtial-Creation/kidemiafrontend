


export default function StatBox({ label, value, icon, color, bg }: { label: string; value: number; icon: any; color: string; bg: string }) {
    return (
        <div className={`flex-shrink-0 min-w-[120px] md:min-w-0 ${bg} rounded-2xl p-4 transition-all`}>
            <div className={`${color} text-lg mb-1`}>{icon}</div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">{label}</div>
        </div>
    );
}