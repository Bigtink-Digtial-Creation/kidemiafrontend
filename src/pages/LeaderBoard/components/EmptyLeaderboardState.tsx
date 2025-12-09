import { Button } from "@heroui/react";
import { Trophy, Target, PlaySquare, PlayIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { SidebarRoutes, TestRoutes } from "../../../routes";

export const EmptyLeaderboardState = () => {

    const navigate = useNavigate();
    return (
        <div className="col-span-12">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-8 md:p-12 border border-gray-200/50 text-center">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-kidemia-primary rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Be the first to appear on the leaderboard! Complete assessments to start XP and climb the ranks.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="px-6 py-2.5 bg-kidemia-primary text-white rounded-full font-semibold hover:shadow-lg transition"
                        onPress={() => navigate(TestRoutes.takeTest)}
                    >
                        Start Practice
                        <PlayIcon className="w-4 h-4" />

                    </Button>
                    <Button className="px-6 py-2.5 bg-white text-gray-700 border border-kidemia-primary rounded-full font-semibold hover:bg-gray-100 transition"
                        onPress={() => navigate(SidebarRoutes.takeAssessment)}>
                        Start Assessment
                        <PlaySquare className="w-4 h-4 text-kidemia-primary" />
                    </Button>
                </div>
            </div>
        </div>
    );
};