import { useNavigate } from "react-router";
import type { AttemptSummaryResponse } from "../../../sdk/generated";
import { AppLogo } from "../../../assets/images";
import AppImage from "../../../components/AppImage";
import { SidebarRoutes } from "../../../routes";

export default function CorrectionHeader({ attempt }: { attempt: AttemptSummaryResponse }) {
    const navigate = useNavigate();
    const mins = Math.floor((attempt.time_spent_seconds || 0) / 60);
    const secs = (attempt.time_spent_seconds || 0) % 60;

    return (
        <header className="px-4 md:px-6 py-4 bg-kidemia-primary radius">
            <div className="flex items-start justify-between">
                <AppImage
                    src={AppLogo}
                    alt="Kidemia Logo"
                    className="max-h-16 object-contain"
                />
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => navigate(SidebarRoutes.dashboard)}
                        className="px-5 py-2.5 rounded-[10px] bg-kidemia-secondary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Dashboard
                    </button>

                    {/* Time */}
                    <p className="text-white text-sm md:text-right text-center">
                        Time Used:{" "}
                        <span className="font-semibold">
                            {mins} mins : {secs} secs
                        </span>
                    </p>
                </div>
            </div>
        </header>
    );
}
