import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Flame,
  Sparkles,
  TrendingUp,
  Crown,
} from "lucide-react";


type LeaderboardUser = {
  id: string;
  rank: number;
  name: string;
  username: string;
  avatar: string;
  points: number;
  coursesCompleted: number;
  streakDays: number;
  badges: Badge[];
  trend?: "up" | "down" | "same";
};

type Badge = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

type FilterType = "assessment" | "subject" | "class" | "institution";
type TimeFrame = "week" | "month" | "allTime";


const generateMockData = (): LeaderboardUser[] => {
  const sample = [
    { name: "Alex Rodriguez", username: "AlexR_21", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Mira Learning", username: "LearnWithMira", avatar: "https://i.pravatar.cc/150?img=45" },
    { name: "Code Junkie", username: "CodeJunkie", avatar: "https://i.pravatar.cc/150?img=33" },
    { name: "Design Guru", username: "DesignGuru", avatar: "https://i.pravatar.cc/150?img=28" },
    { name: "Math Master", username: "MathMaster", avatar: "https://i.pravatar.cc/150?img=56" },
    { name: "Growth Hacker", username: "GrowthHacker", avatar: "https://i.pravatar.cc/150?img=67" },
    { name: "Dev Wizard", username: "DevWizard", avatar: "https://i.pravatar.cc/150?img=15" },
    { name: "Sarah Chen", username: "You", avatar: "https://i.pravatar.cc/150?img=25" },
    { name: "UI Explorer", username: "UIUXExplorer", avatar: "https://i.pravatar.cc/150?img=22" },
  ];

  const badges: Badge[] = [
    { id: "1", name: "Monthly Cham", icon: "🏆", color: "bg-amber-50 text-amber-700 border border-amber-200" },
    { id: "2", name: "Quiz Master", icon: "🎯", color: "bg-rose-50 text-rose-700 border border-rose-200" },
    { id: "3", name: "Top Designer", icon: "🎨", color: "bg-purple-50 text-purple-700 border border-purple-200" },
    { id: "4", name: "Streak", icon: "🔥", color: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  ];

  const trend: ("up" | "down" | "same")[] = ["up", "down", "same", "up"];

  return sample.map((u, i) => ({
    id: `u-${i}`,
    rank: i + 1,
    name: u.name,
    username: u.username,
    avatar: u.avatar,
    points: 1500 - i * 60,
    coursesCompleted: 10 - i,
    streakDays: 20 - i,
    trend: trend[i % 4],
    badges: badges.slice(0, 2),
  }));
};


const useLeaderboardData = (filter: FilterType, timeFrame: TimeFrame) => {
  return useQuery({
    queryKey: ["leaderboard", filter, timeFrame],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return generateMockData();
    },
    staleTime: 20000,
  });
};


const TimeFrameToggle = ({
  timeFrame,
  setTimeFrame,
}: {
  timeFrame: TimeFrame;
  setTimeFrame: (t: TimeFrame) => void;
}) => {
  const frames = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "allTime", label: "All Time" },
  ];

  return (
    <div className="flex gap-1.5 bg-white/60 backdrop-blur-xl rounded-full p-1 border border-gray-200/50">
      {frames.map((tf) => (
        <button
          key={tf.key}
          onClick={() => setTimeFrame(tf.key as TimeFrame)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${timeFrame === tf.key
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
};


const FilterRow = ({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
}) => {
  const filters = [
    { key: "assessment", label: "Assessment" },
    { key: "subject", label: "Subject" },
    { key: "class", label: "Class" },
    { key: "institution", label: "Institution" },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setActiveFilter(f.key as FilterType)}
          className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === f.key
            ? "bg-kidemia-primary text-white shadow-lg shadow-kidemia-primary/50"
            : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200"
            }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};
const MotivationCard = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-kidemia-primary via-kidemia-primary to-pink-500 rounded-3xl p-6 mb-6 border border-white/20">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl"></div>

    <div className="relative flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-yellow-300 text-sm font-semibold">Keep Going!</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          You're closer than you think!
        </h2>

        <p className="text-indigo-100 text-sm mb-4">
          Just 9 points away from breaking into the Top 10.
        </p>

        <button className="bg-white text-kidemia-primary px-5 py-2 rounded-xl font-semibold hover:-kidemia-secondary hover:text-kidemia-white hover:scale-105 transition">
          Continue Learning
        </button>
      </div>

      <div className="hidden lg:flex flex-wrap gap-2 max-w-xs ml-4">
        {["🏆 Champion", "🔥 Streaker", "🎨 Designer", "⚡ Fast Learner"].map((b, i) => (
          <span
            key={i}
            className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-full text-xs text-white"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  </div>
);


const TopThreePanel = ({ users }: { users: LeaderboardUser[] }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-gray-200/50">
    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
      <Crown className="w-4 h-4 text-amber-500" />
      Top Performers
    </h3>

    <div className="space-y-3">
      {users.map((u, i) => (
        <div
          key={u.id}
          className={`group bg-gradient-to-br rounded-2xl p-4 hover:scale-[1.02] transition cursor-pointer
          ${i === 0
              ? "from-amber-50 to-yellow-50 border border-amber-200"
              : i === 1
                ? "from-gray-50 to-slate-50 border border-gray-300"
                : "from-orange-50 to-amber-50 border border-orange-200"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={u.avatar}
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              />
              <div
                className={`absolute -top-1 -right-1 w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold ${i === 0
                  ? "bg-amber-500"
                  : i === 1
                    ? "bg-gray-400"
                    : "bg-orange-500"
                  }`}
              >
                {i + 1}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm truncate">
                {u.name}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>{u.coursesCompleted} courses</span>
                <span className="flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-orange-500" />
                  {u.streakDays}d
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-kidemia-primary">
                {u.points}
              </div>
              <div className="text-xs text-gray-500">pts</div>
            </div>
          </div>

          <div className="flex gap-1.5 mt-3">
            {u.badges.slice(0, 2).map((b) => (
              <span key={b.id} className={`${b.color} px-2 py-0.5 rounded-full text-xs`}>
                {b.icon} {b.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);


const RankList = ({
  users,
  currentUserIndex,
}: {
  users: LeaderboardUser[];
  currentUserIndex: number;
}) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-200/50">
    <div className="p-5 border-b border-gray-200/50">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-indigo-600" />
        Full Rankings
      </h3>
    </div>

    <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
      <div className="divide-y divide-gray-100">
        {users.map((u, i) => (
          <div
            key={u.id}
            className={`px-5 py-4 transition ${i === currentUserIndex ? "bg-kidemia-white/90" : "hover:bg-gray-50"
              }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold w-6 text-center text-indigo-600">
                {u.rank}
              </div>

              <img
                src={u.avatar}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />

              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{u.name}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{u.coursesCompleted} courses</span>
                  <span className="flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {u.streakDays}d
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex gap-1.5">
                {u.badges.slice(0, 2).map((b) => (
                  <span key={b.id} className={`${b.color} px-2 py-1 rounded-lg text-xs`}>
                    {b.icon}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {u.trend === "up" && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {u.trend === "down" && (
                  <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                )}
                {u.trend === "same" && (
                  <TrendingUp className="w-4 h-4 text-gray-400 rotate-90" />
                )}

                <div className="text-sm font-semibold text-kidemia-primary">
                  {u.points}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


export default function ModernLeaderboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("assessment");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");

  const { data, isLoading } = useLeaderboardData(activeFilter, timeFrame);

  const topThree = data?.slice(0, 3) || [];
  const currentUserIndex = 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-500 text-sm">Compete with learners worldwide</p>
          </div>

          <TimeFrameToggle timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        </div>

        <FilterRow activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <MotivationCard />

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <TopThreePanel users={topThree} />
            )}
          </div>

          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <RankList users={data || []} currentUserIndex={currentUserIndex} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }

        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
}
