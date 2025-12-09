import { useNavigate } from "react-router";
import type { AttemptSummaryResponse } from "../../../sdk/generated";
import { AppLogo } from "../../../assets/images";
import AppImage from "../../../components/AppImage";
import { SidebarRoutes } from "../../../routes";
import { BiArrowBack } from "react-icons/bi";

export default function CorrectionHeader({ attempt }: { attempt: AttemptSummaryResponse }) {
    const navigate = useNavigate();
    const mins = Math.floor((attempt.time_spent_seconds || 0) / 60);
    const secs = (attempt.time_spent_seconds || 0) % 60;

    return (
        <header className="px-4 md:px-6 py-4 bg-kidemia-primary radius">
            <div className="flex items-center justify-between">

                <button
                    onClick={() => navigate(SidebarRoutes.dashboard)}
                    className="block sm:hidden px-3 py-2 rounded-md bg-kidemia-secondary text-white text-lg hover:opacity-90 transition"
                >
                    <BiArrowBack />
                </button>

                <div className="flex-1 flex justify-center sm:justify-start">
                    <AppImage
                        src={AppLogo}
                        alt="Kidemia Logo"
                        className="max-h-16 object-contain"
                    />
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2">
                    <button
                        onClick={() => navigate(SidebarRoutes.dashboard)}
                        className="px-5 py-2.5 rounded-[10px] bg-kidemia-secondary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Dashboard
                    </button>

                    <p className="text-white text-sm text-right">
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
