

export default function TopicStatCard({ icon, label, count, color }: any) {
    const borders: any = { dark: 'border-slate-900', primary: 'border-kidemia-primary', secondary: 'border-kidemia-secondary' };
    return (
        <div className={`bg-white border ${borders[color]} p-5 rounded-2xl flex items-center gap-4`}>
            {icon}
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
                <p className="text-2xl font-black text-slate-900">{count}</p>
            </div>
        </div>
    )
}