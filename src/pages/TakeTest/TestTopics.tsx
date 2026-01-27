import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import CustomCheckbox from "../../components/Cards/CustomCheckbox";
import {
  Button,
  CheckboxGroup,
  Pagination,
} from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useAtom, useAtomValue } from "jotai";
import {
  selectedSubjectTitleAtom,
  selectedTopicsAtom,
} from "../../store/test.atom";
import LoadingSequence from "../../components/Loading/LoadingSequence";


const TIP_MESSAGES = [
  "Pick the areas you feel most confident in or would like to challenge yourself with.",
  "You need at least 5 topics to generate a balanced practice test.",
  "Focused practice on specific topics helps you master difficult concepts faster.",
  "Don't worry, you can always come back and try other topics later!",
  "Pro tip: Mix easy and hard topics to build real exam stamina."
];

export default function TestTopicsPage() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [selectedTopics, setSelectedTopics] = useAtom(selectedTopicsAtom);
  const [page, setPage] = useState<number>(1);
  const subjectTitle = useAtomValue(selectedSubjectTitleAtom);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();


  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % TIP_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { data: topicData, isLoading } = useQuery({
    queryKey: [QueryKeys.allTopics, id],
    queryFn: () =>
      ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
        id as string,
      ),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <LoadingSequence
        lines={[
          {
            text: "Loading Practice topics...",
            className: "text-lg md:text-xl text-kidemia-primary",
          },
          {
            text: "This will take a short time.",
            className: "text-lg md:text-xl text-kidemia-secondary",
          },
          {
            text: "Getting ready for practice",
          },
        ]}
      />
    );
  }

  const totalTopics = topicData?.items?.length ?? 0;
  const paginatedTopics = topicData?.items?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleSelectionChange = (values: string[]) => {
    const updated = topicData?.items
      ?.filter((topic) => values.includes(topic.id))
      .map((topic) => ({
        id: topic.id,
        name: topic.name,
        description: topic.description || "No description",
        code: topic.code,
        estimated_time_minutes: topic.estimated_time_minutes || 0,
        questions_count: topic.questions_count || 0,
        difficulty_level: topic.difficulty_level || "",
      })) ?? [];

    setSelectedTopics(updated);
  };

  return (
    <section className="py-4 space-y-8 md:space-y-12 md:px-12 w-full relative min-h-screen">
      <div className="sticky top-0 z-20  backdrop-blur-md md:static md:bg-transparent md:backdrop-blur-none -mx-4 px-4 py-2 md:mx-0 md:px-0">
        <Button
          variant="light"
          radius="full"
          onPress={() => navigate(-1)}
          startContent={<ChevronLeft size={20} />}
          className="text-kidemia-secondary font-semibold hover:bg-kidemia-biege/50 px-2 min-w-0"
        >
          Back
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl text-kidemia-black font-semibold text-center leading-tight">
          Select at least 5 {subjectTitle ? subjectTitle : ""} Topics that Interest
          You the Most
        </h2>
        <div className="h-12 flex items-center justify-center overflow-hidden">
          <p
            key={messageIndex} // Key triggers the animation when index changes
            className="text-sm md:text-base text-kidemia-grey text-center font-medium max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {TIP_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-hidden px-2 md:px-0">
        <CheckboxGroup
          classNames={{
            base: "w-full",
          }}
          value={selectedTopics.map((t) => t.id)}
          onChange={handleSelectionChange}
          orientation="horizontal"
        >
          {paginatedTopics?.map((topics) => (
            <div key={topics.id} className="w-full md:w-auto">
              <CustomCheckbox
                value={topics.id}
                name={topics.name}
                difficulty_level={topics.difficulty_level || ""}
              />
            </div>
          ))}
        </CheckboxGroup>
      </div>

      {totalTopics > itemsPerPage && (
        <div className="flex justify-center py-4">
          <Pagination
            radius="sm"
            total={Math.ceil(totalTopics / itemsPerPage)}
            page={page}
            onChange={setPage}
            color="warning"
            variant="bordered"
            classNames={{
              cursor: "border-1 bg-transparent text-kidemia-primary",
              item: "bg-transparent shadow-none cursor-pointer",
            }}
            showControls
          />
        </div>
      )}

      {/* Footer Action Area */}
      <div className="flex md:justify-end flex-col items-end gap-2 px-4 md:px-0 pb-8">
        <Button
          type="button"
          variant="solid"
          size="lg"
          className="bg-kidemia-secondary text-white font-semibold w-full md:w-1/4 shadow-lg shadow-kidemia-secondary/20"
          radius="sm"
          onPress={() => navigate(`/take-a-test/${id}/instructions`)}
        >
          Continue
        </Button>

        {selectedTopics.length < 5 && (
          <p className="text-xs text-danger-500 font-medium italic">
            Please select {5 - selectedTopics.length} more topic(s) to continue.
          </p>
        )}
      </div>
    </section>
  );
}