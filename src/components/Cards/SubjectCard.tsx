import { Link } from "react-router";
import { useSetAtom } from "jotai";
import { TestRoutes } from "../../routes";
import { Avatar } from "@heroui/react";
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
}

export default function SubjectCard({
  id,
  icon_url,
  title,
  topics_count,
  description,
  color_code,
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
      className={`px-4 py-8 rounded-2xl shadow-sm  cursor-pointer flex flex-col justify-center items-center space-y-4 hover:shadow-xl`}
      style={{ backgroundColor: hexToRgba(color_code || "#F9F9F9", 0.15) }}
    >
      <div>
        <Avatar
          src={icon_url}
          className="bg-kidemia-white/40 text-kidemia-black text-lg uppercase font-bold"
          showFallback
          name={getNameIntials(title) as string}
        />
      </div>
      <div className="space-y-3 flex items-center flex-col">
        <h3 className="text-xl font-medium text-kidemia-black">{title}</h3>
        <p className="text-sm text-center text-kidemia-black">{description}</p>
        <div className="w-full">
          <p className="text-sm text-center text-kidemia-black">
            {topics_count} topics
          </p>
        </div>
      </div>
    </Link>
  );
}
