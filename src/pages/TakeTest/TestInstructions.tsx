import { Button } from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { useAtomValue } from "jotai";
import {
  // selectedSubjectIdeAtom,
  selectedSubjectTitleAtom,
  selectedTopicsAtom,
} from "../../store/test.atom";

export default function TestInstructionsPage() {
  const { id } = useParams<{ id: string }>();

  const subjectTitle = useAtomValue(selectedSubjectTitleAtom);
  const topics = useAtomValue(selectedTopicsAtom);
  // const subjectId = useAtomValue(selectedSubjectIdeAtom);
  const navigate = useNavigate();

  return (
    <section className="flex flex-col min-h-screen py-4 space-y-12 md:px-12">
      <div className="absolute top-4 left-0 px-4">

      </div>
      <div className="flex-1 space-y-12">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl text-kidemia-black font-semibold text-center">
            You are writing {subjectTitle}
          </h2>
          <p className="text-md md:text-xl text-kidemia-grey font-medium">
            You'll be answering questions based on the topics below. Take a deep
            breath and give it your best shot.
          </p>

          <ul className="space-y-1.5">
            {topics.map((topic) => (
              <li
                key={topic.id}
                className="text-sm text-kidemia-black list-decimal list-inside"
              >
                {topic.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl md:text-2xl text-kidemia-black font-semibold text-center">
            Read All Instructions Before You Start
          </h2>

          <ol className="list-decimal list-inside space-y-2">
            <li className="text-md text-kidemia-black3">
              Ensure you have a stable internet connection before starting the
              test.
            </li>
            <li className="text-md text-kidemia-black3">
              Once you begin, do not refresh or close this tab until you finish.
            </li>
            <li className="text-md text-kidemia-black3">
              Avoid switching to other apps or browser tabs — doing so may end
              your test.
            </li>
            <li className="text-md text-kidemia-black3">
              Read each question carefully before selecting your answer.
            </li>
            <li className="text-md text-kidemia-black3">
              When you're ready, click{" "}
              <span className="font-semibold">Start Test</span> to begin.
            </li>
          </ol>
        </div>
      </div>
      <div className="md:absolute md:bottom-0 md:right-4 md:py-5 px-4">
        <div className="space-y-6">
          <p className="text-md font-semibold text-kidemia-black">
            If you are ready click on the button to begin
          </p>

          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            onPress={() => navigate(`/take-a-test/${id}/details`)}
          >
            Start Test
          </Button>
        </div>
      </div>
    </section>
  );
}
