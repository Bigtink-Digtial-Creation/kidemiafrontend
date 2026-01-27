import { Link } from "react-router";
import { useSetAtom } from "jotai";
import { TestRoutes } from "../../routes";
import { Avatar, Chip } from "@heroui/react";
import { getNameIntials, hexToRgba } from "../../utils";
import {
  selectedSubjectIdeAtom,
  selectedSubjectTitleAtom,
} from "../../store/test.atom";

interface SubjectCardI {
  id: string;
  icon_url: string;
  title: string;
  topics_count: number;
  description: string;
  color_code: string;
  category_name?: string; // Added optional category name
}

export default function SubjectCard({
  id,
  icon_url,
  title,
  topics_count,
  description,
  color_code,
  category_name,
}: SubjectCardI) {
  const subjectPath = TestRoutes.subjectTopics.replace(":id", id);
  const setSelectedTitle = useSetAtom(selectedSubjectTitleAtom);
  const setSelectedId = useSetAtom(selectedSubjectIdeAtom);

  const handleClick = () => {
    setSelectedTitle(title);
    setSelectedId(id);
  };

  return (
    <Link
      to={subjectPath}
      onClick={handleClick}
      className="group relative px-4 py-8 rounded-2xl shadow-sm cursor-pointer flex flex-col justify-center items-center space-y-4 hover:shadow-xl transition-all duration-300 ease-in-out border border-transparent hover:border-white/50"
      style={{ backgroundColor: hexToRgba(color_code || "#F9F9F9", 0.15) }}
    >
      {/* Category Badge - Subtle and clean */}
      {category_name && (
        <div className="absolute top-3 right-3">
          <Chip
            size="sm"
            variant="flat"
            className="text-[10px] h-5 uppercase font-bold bg-white/40 text-kidemia-black/70 backdrop-blur-sm border-none"
          >
            {category_name}
          </Chip>
        </div>
      )}

      <div>
        <Avatar
          src={icon_url}
          className="w-16 h-16 bg-white/60 text-kidemia-black text-xl uppercase font-bold shadow-sm group-hover:scale-110 transition-transform duration-300"
          showFallback
          name={getNameIntials(title) as string}
        />
      </div>

      <div className="space-y-2 flex items-center flex-col text-center">
        <h3 className="text-lg font-bold text-kidemia-black leading-tight">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-kidemia-black/60 line-clamp-2 min-h-[32px]">
            {description}
          </p>
        )}

        <div className="pt-2">
          <span className="px-3 py-1 rounded-full bg-white/40 text-[11px] font-semibold text-kidemia-black shadow-sm">
            {topics_count} Topics
          </span>
        </div>
      </div>
    </Link>
  );
}