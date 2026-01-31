

export default function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-white text-kidemia-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}