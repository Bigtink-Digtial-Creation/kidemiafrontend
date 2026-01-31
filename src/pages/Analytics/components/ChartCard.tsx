export default function ChartCard({ title, icon, children }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                {icon}
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
            <div className="flex-1 w-full min-h-[300px]">
                {children}
            </div>
        </div>
    );
}