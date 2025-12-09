import type { CategoryConfigResponse } from "../../../sdk/generated";
import type { Category } from "../types/leaderboard";

interface CategoryFilterProps {
    active: string;
    setActive: (category: string) => void;
    categories: CategoryConfigResponse[];
    isLoading?: boolean;
}

export const CategoryFilter = ({ active, setActive, categories, isLoading }: CategoryFilterProps) => {
    if (isLoading) {
        return (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-9 w-32 bg-gray-200 rounded-full animate-pulse"
                    />
                ))}
            </div>
        );
    }
    const allCategories: Category[] = [
        { id: "all", display_name: "General" },
        ...categories,
    ];

    return (
        <div className="relative mb-6">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {allCategories.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setActive(c.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${active === c.id
                            ? "bg-kidemia-primary text-white shadow-lg shadow-kidemia-primary/30"
                            : "bg-white/80 text-gray-700 hover:bg-white border border-gray-200"
                            }`}
                    >
                        {c.display_name}
                    </button>
                ))}
            </div>
            <style>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};