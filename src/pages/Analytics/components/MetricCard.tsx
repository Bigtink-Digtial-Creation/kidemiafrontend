export default function MetricCard({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        primary: 'bg-kidemia-primary/10 text-kidemia-primary',
        secondary: 'bg-kidemia-secondary/10 text-kidemia-secondary',
        emerald: 'bg-emerald-100 text-emerald-700',
        rose: 'bg-rose-100 text-rose-700',
    };
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );
}
