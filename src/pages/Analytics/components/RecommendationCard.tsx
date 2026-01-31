import type { PersonalizedRecommendation } from "../../../sdk/generated";

export default function RecommendationCard({ rec }: { rec: PersonalizedRecommendation }) {
    return (
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{rec.icon}</span>
                <h4 className="font-bold text-sm text-slate-900">{rec.title}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{rec.description}</p>
        </div>
    )
}