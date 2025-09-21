import { Link } from "react-router";
import type { IconType } from "react-icons";
import { TestRoutes } from "../../routes";

interface SubjectCardI {
  icon: IconType;
  title: string;
  topics: string;
}

export default function SubjectCard({
  icon: Icon,
  title,
  topics,
}: SubjectCardI) {
  const subjectId = title.toLowerCase().replace(/\s+/g, "-");

  const subjectPath = TestRoutes.subjectTopics.replace(":id", subjectId);

  return (
    <Link
      to={subjectPath}
      className="px-4 py-8 rounded-2xl shadow-sm bg-kidemia-white/40 cursor-pointer flex flex-col justify-center items-center space-y-4 hover:shadow-xl hover:bg-kidemia-white"
    >
      <div>
        <Icon className="text-3xl text-kidemia-secondary font-bold" />
      </div>
      <div className="space-y-3 flex items-center flex-col">
        <h3 className="text-xl font-medium text-kidemia-primary">{title}</h3>
        <p className="text-md  text-kidemia-grey">{topics}</p>
      </div>
    </Link>
  );
}
