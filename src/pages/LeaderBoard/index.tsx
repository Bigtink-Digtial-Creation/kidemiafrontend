import { useState } from "react";
import { Trophy, Flame, TrendingUp, Crown, Award } from "lucide-react";

// Types
interface Badge {
  id: string;
  name: string;
  display_name: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  color: string;
}

interface Student {
  id: string;
  rank: number;
  name: string;
  student_code: string;
  avatar: string;
  total_points: number;
  current_level: number;
  experience_points: number;
  current_streak: number;
  longest_streak: number;
  total_assessments_completed: number;
  correct_answers: number;
  total_questions_answered: number;
  rank_title: string;
  trend: "up" | "down" | "same";
  badges: Badge[];
  category_name: string;
}

interface Category {
  id: string;
  display_name: string;
}



const generateMockData = (): Student[] => {
  const students = [
    { name: "Adaeze Okonkwo", student_code: "STU-2024-001", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Chidi Emenike", student_code: "STU-2024-002", avatar: "https://i.pravatar.cc/150?img=45" },
    { name: "Fatima Bello", student_code: "STU-2024-003", avatar: "https://i.pravatar.cc/150?img=33" },
    { name: "Emeka Nwachukwu", student_code: "STU-2024-004", avatar: "https://i.pravatar.cc/150?img=28" },
    { name: "Aisha Mohammed", student_code: "STU-2024-005", avatar: "https://i.pravatar.cc/150?img=56" },
    { name: "Tunde Adeyemi", student_code: "STU-2024-006", avatar: "https://i.pravatar.cc/150?img=67" },
    { name: "Ngozi Okafor", student_code: "STU-2024-007", avatar: "https://i.pravatar.cc/150?img=15" },
    { name: "You", student_code: "STU-2024-008", avatar: "https://i.pravatar.cc/150?img=25" },
    { name: "Yusuf Ibrahim", student_code: "STU-2024-009", avatar: "https://i.pravatar.cc/150?img=22" },
  ];

  const badges: Badge[] = [
    { id: "1", name: "first_steps", display_name: "First Steps", icon: "🎯", rarity: "common", color: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    { id: "2", name: "streak_master", display_name: "Streak Master", icon: "🔥", rarity: "rare", color: "bg-orange-50 text-orange-700 border border-orange-200" },
    { id: "3", name: "perfectionist", display_name: "Perfectionist", icon: "💯", rarity: "epic", color: "bg-purple-50 text-purple-700 border border-purple-200" },
    { id: "4", name: "jamb_master", display_name: "JAMB Master", icon: "👑", rarity: "legendary", color: "bg-amber-50 text-amber-700 border border-amber-200" },
  ];

  const trends: Array<"up" | "down" | "same"> = ["up", "down", "same", "up"];

  return students.map((s, i) => ({
    id: `student-${i}`,
    rank: i + 1,
    name: s.name,
    student_code: s.student_code,
    avatar: s.avatar,
    total_points: 2500 - i * 150,
    current_level: Math.max(1, 10 - i),
    experience_points: 2500 - i * 150,
    current_streak: Math.max(0, 25 - i * 2),
    longest_streak: Math.max(5, 30 - i * 2),
    total_assessments_completed: Math.max(1, 50 - i * 4),
    correct_answers: Math.max(10, 400 - i * 35),
    total_questions_answered: Math.max(15, 500 - i * 40),
    rank_title: ["Legend", "Master", "Expert", "Advanced", "Intermediate", "Intermediate", "Beginner", "Beginner", "Beginner"][i],
    trend: trends[i % 4],
    badges: badges.slice(0, Math.max(1, 4 - Math.floor(i / 2))),
    category_name: ["JAMB", "WAEC", "JAMB", "NECO", "JAMB", "WAEC", "JAMB", "JAMB", "WAEC"][i],
  }));
};

interface CategoryFilterProps {
  active: string;
  setActive: (category: string) => void;
}

const CategoryFilter = ({ active, setActive }: CategoryFilterProps) => {
  const categories: Category[] = [
    { id: "all", display_name: "All Categories" },
    { id: "jamb", display_name: "JAMB" },
    { id: "waec", display_name: "WAEC" },
    { id: "neco", display_name: "NECO" },
    { id: "post-utme", display_name: "Post-UTME" },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((c) => (
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
  );
};




interface TopThreePanelProps {
  students: Student[];
}

const TopThreePanel = ({ students }: TopThreePanelProps) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-200/50">
      <h3 className="text-sm font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
        <Crown className="w-4 h-4 text-amber-500" />
        Top Performers
      </h3>

      <div className="space-y-2 md:space-y-3">
        {students.map((s, i) => (
          <div
            key={s.id}
            className={`group bg-gradient-to-br rounded-xl md:rounded-2xl p-3 md:p-4 hover:scale-[1.02] transition cursor-pointer ${i === 0
              ? "from-amber-50 to-yellow-50 border border-amber-200"
              : i === 1
                ? "from-gray-50 to-slate-50 border border-gray-300"
                : "from-orange-50 to-amber-50 border border-orange-200"
              }`}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative">
                <img src={s.avatar} alt={s.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md" />
                <div
                  className={`absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-gray-400" : "bg-orange-500"
                    }`}
                >
                  {i + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-xs md:text-sm truncate">{s.name}</h4>
                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-600">
                  <span className="flex items-center gap-0.5 md:gap-1">
                    <Award className="w-3 h-3" />
                    Lvl {s.current_level}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {s.current_streak}d
                  </span>
                  <span className="text-gray-400 hidden sm:inline">{s.category_name}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs md:text-sm font-semibold text-kidemia-primary">{s.total_points.toLocaleString()}</div>
                <div className="text-[10px] md:text-xs text-gray-500">pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RankListProps {
  students: Student[];
  currentStudentIndex: number;
}

const RankList = ({ students, currentStudentIndex }: RankListProps) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-200/50 overflow-hidden">
    <div className="p-4 md:p-5 border-b border-gray-200/50">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-kidemia-primary" />
        Full Rankings
      </h3>
    </div>

    <div className="divide-y divide-gray-100">
      {students.map((s, i) => (
        <div
          key={s.id}
          className={`px-4 md:px-5 py-3 md:py-4 transition ${i === currentStudentIndex ? "bg-kidemia-primary/5 border-l-4 border-kidemia-primary" : "hover:bg-gray-50"
            }`}
        >
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-xs md:text-sm font-bold w-5 md:w-6 text-center text-kidemia-primary">{s.rank}</div>

            <img src={s.avatar} alt={s.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-xs md:text-sm truncate">
                {s.name}
                {i === currentStudentIndex && (
                  <span className="ml-2 text-[10px] md:text-xs bg-kidemia-primary text-white px-1.5 md:px-2 py-0.5 rounded-full">You</span>
                )}
              </p>
              <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500">
                <span className="flex items-center gap-0.5 md:gap-1">
                  <Award className="w-3 h-3" />
                  {s.rank_title}
                </span>
                <span className="hidden sm:inline">{s.total_assessments_completed} tests</span>
                <span className="flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-orange-500" />
                  {s.current_streak}d
                </span>
              </div>
            </div>

            <div className="hidden sm:flex gap-1.5">
              {s.badges.slice(0, 2).map((b) => (
                <span key={b.id} className={`${b.color} px-2 py-1 rounded-lg text-xs`} title={b.display_name}>
                  {b.icon}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {s.trend === "up" && <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />}
              {s.trend === "down" && <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-red-500 rotate-180" />}
              {s.trend === "same" && <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400 rotate-90" />}
              <div className="text-xs md:text-sm font-semibold text-kidemia-primary">{s.total_points.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function StudentLeaderboard() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [timeFrame, setTimeFrame] = useState<string>("month");

  const data = generateMockData();
  const topThree = data.slice(0, 3);
  const currentStudentIndex = 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-500 text-xs md:text-sm">Compete with learners across Nigeria</p>
          </div>
          {/* <TimeFrameToggle timeFrame={timeFrame} setTimeFrame={setTimeFrame} /> */}
        </div>

        <CategoryFilter active={activeCategory} setActive={setActiveCategory} />

        <div className="grid lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-5">
            <TopThreePanel students={topThree} />
          </div>
          <div className="lg:col-span-7">
            <RankList students={data} currentStudentIndex={currentStudentIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}
