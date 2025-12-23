import { Button, Chip, Pagination } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import AssessmentCard from "../../components/Cards/AssessmentCard";
import { useMemo, useState } from "react";
import SpinnerCircle from "../../components/Spinner/Circle";
import { useAtomValue } from "jotai";
import { useUserWallet, loggedinUserAtom } from "../../store/user.atom";
import type { AssessmentCategory } from "../../sdk/generated";
import { useNavigate } from "react-router";
import { PaymentRoutes } from "../../routes";

export enum AssessmentType {
  TEST = "test",
  EXAM = "exam",
}

export enum AssessmentStatus {
  DRAFT = "draft",
  REVIEW = "review",
  PUBLISHED = "published",
  SCHEDULED = "scheduled",
  ARCHIVED = "archived",
  SUSPENDED = "suspended",
}


export default function AssessmentPage() {
  const navigate = useNavigate();
  const { data: wallet } = useUserWallet();
  const loggedInUser = useAtomValue(loggedinUserAtom);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const userAssessmentCategory = loggedInUser?.user?.student?.category?.category_name;
  const category: AssessmentCategory | null =
    userAssessmentCategory
      ? (userAssessmentCategory.toLowerCase() as AssessmentCategory)
      : null;
  const { data: assessmentData, isLoading } = useQuery({
    queryKey: [QueryKeys.allAssessment],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentsApiV1AssessmentsGet(AssessmentType.EXAM,
        category,   // category
        undefined,   // subjectId
        AssessmentStatus.PUBLISHED),
  });

  const assessment = useMemo(
    () => assessmentData?.items || [],
    [assessmentData],
  );

  const totalPages = Math.ceil(assessment.length / pageSize);

  const currentPageData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return assessment.slice(startIndex, endIndex);
  }, [assessment, page, pageSize]);

  if (isLoading || !assessmentData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SpinnerCircle />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center space-x-6">
          <Chip
            variant="flat"
            color="primary"
            className="text-sm font-semibold whitespace-nowrap"
          >
            Unit balance : ({wallet?.symbol}) {wallet?.balance}
          </Chip>
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full px-8"
            size="sm"
            radius="sm"
            type="button"

            onPress={() => navigate(PaymentRoutes.buytoken)}
          >
            Buy Unit
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-kidemia-grey text-lg">Explore Past Assessements</p>
        </div>

        <div className="py-4">
          {assessment?.length === 0 ? (
            <div>
              <p className="text-center text-kidemia-grey italic">
                No Available Assessment
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {currentPageData?.map((asst) => (
                  <AssessmentCard
                    key={asst.id}
                    id={asst.id}
                    title={asst.title}
                    code={asst.code}
                    timeMins={asst.duration_minutes}
                    questionsNo={asst.total_questions}
                    attemptsNo={asst.total_attempts}
                    priceNo={asst.price}
                    avgScore={asst.average_score}
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <Pagination
                  radius="sm"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                  showControls
                  classNames={{
                    cursor: "border-1 bg-transparent text-kidemia-primary",
                    item: "bg-transparent shadow-none cursor-pointer",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
