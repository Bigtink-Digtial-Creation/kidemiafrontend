import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import CustomCheckbox from "../../components/Cards/CustomCheckbox";
import { Button, CheckboxGroup, Pagination, Spinner } from "@heroui/react";
import { TestRoutes } from "../../routes";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useAtom, useAtomValue } from "jotai";
import {
  selectedSubjectTitleAtom,
  selectedTopicsAtom,
} from "../../store/test.atom";

export default function TestTopicsPage() {
  const [selectedTopics, setSelectedTopics] = useAtom(selectedTopicsAtom);
  const [page, setPage] = useState<number>(1);
  const subjectTitle = useAtomValue(selectedSubjectTitleAtom);
  const itemsPerPage = 10;

  console.log({ selectedTopics });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  const totalTopics = topicData?.items?.length ?? 0;
  const paginatedTopics = topicData?.items?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleSelectionChange = (values: string[]) => {
    if (values.length <= 5) {
      // Update selectedTopics atom with full topic data for selected IDs
      const updated =
        topicData?.items
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
    }
  };

  return (
    <section className="py-4 space-y-12 md:px-12 w-full">
      <div className="space-y-3">
        <h2 className="text-2xl text-kidemia-black font-semibold text-center">
          Choose up to 5 {subjectTitle ? subjectTitle : ""} Topics that Interest
          You the Most
        </h2>
        <p className="text-base text-kidemia-grey text-center font-medium max-w-2xl mx-auto">
          Pick the areas you feel most confident in or would like to challenge
          yourself with. Once selected, you can proceed to begin your test.
        </p>
      </div>

      <div className="w-full overflow-x-hidden">
        <CheckboxGroup
          classNames={{
            base: "w-full",
          }}
          value={selectedTopics.map((t) => t.id)}
          onChange={handleSelectionChange}
          orientation="horizontal"
        >
          {paginatedTopics?.map((topics) => (
            <div key={topics.id}>
              <CustomCheckbox
                value={topics.id}
                name={topics.name}
                description={topics.description || "No description"}
                code={topics.code}
                estimated_time_minutes={topics.estimated_time_minutes || 0}
                questions_count={topics.questions_count || 0}
                difficulty_level={topics.difficulty_level || ""}
              />
            </div>
          ))}
        </CheckboxGroup>
      </div>

      {totalTopics > itemsPerPage && (
        <div className="flex justify-center">
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

      <div className="flex md:justify-end">
        <Button
          type="button"
          variant="solid"
          size="lg"
          className="bg-kidemia-secondary text-kidemia-white font-semibold w-full md:w-1/4"
          radius="sm"
          // isDisabled={groupSelected.length !== 5}
          isDisabled={selectedTopics.length !== 5}
          onPress={() => navigate(TestRoutes.testIntructions)}
        >
          Continue
        </Button>
      </div>
    </section>
  );
}
