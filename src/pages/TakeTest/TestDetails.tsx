import { useAtomValue } from 'jotai';
import { useNavigate, useParams } from 'react-router';
import { selectedSubjectIdeAtom, selectedTopicsAtom } from '../../store/test.atom';
import { useQuery } from '@tanstack/react-query';
import { ApiSDK } from '../../sdk';
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, Spinner } from '@heroui/react';
import { SidebarRoutes, TestRoutes } from '../../routes';
import { FiClock } from 'react-icons/fi';
import { BiPlayCircle } from 'react-icons/bi';
import { QueryKeys } from '../../utils/queryKeys';

export default function TestDetails() {
  const { id } = useParams<{ id: string }>();
  const subjectId = useAtomValue(selectedSubjectIdeAtom);
  const selectedTopics = useAtomValue(selectedTopicsAtom);
  const topicIds = selectedTopics.map((topic) => topic.id);
  const navigate = useNavigate()


  // const { data: attemptId, isLoading: isAttemptId } = useQuery({
  //   queryKey: [QueryKeys.assesstmentAttempt, id],
  //   queryFn: () =>
  //     ApiSDK.AttemptsService.startAttemptApiV1AttemptsAssessmentIdStartPost(
  //       id!,
  //       {},
  //     ),
  //   enabled: !!id,
  // });

  // console.log({ attemptId });

  const { data: testDetails, isLoading } = useQuery({
    queryKey: [QueryKeys.testDetails, id, topicIds],
    queryFn: ({ queryKey }) => {
      const [, assessmentId, topicIds] = queryKey;
      return ApiSDK.AssessmentsService.autoGenerateAssessmentApiV1AssessmentsAutoGeneratePost({
        subject_id: assessmentId as string,
        topic_ids: topicIds as string[],
      });
    },
    enabled: !!id && !!topicIds?.length,
  });

  console.log({ testDetails });


  if (isLoading || !testDetails) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <section className="max-w-5xl w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-0 px-4">
        <div>
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem href={SidebarRoutes.dashboard}>
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem href={TestRoutes.takeTest}>
              Take a Test
            </BreadcrumbItem>
            <BreadcrumbItem href={TestRoutes.testSubjects}>
              Pick a Subject
            </BreadcrumbItem>

            <BreadcrumbItem href={`/take-a-test/subjects/${subjectId}`}>
              Pick Subject Topics
            </BreadcrumbItem>

            <BreadcrumbItem href={`/take-a-test/${subjectId}/instructions`} >Test Intructions</BreadcrumbItem>
            <BreadcrumbItem color='warning'>Test Details</BreadcrumbItem>

          </Breadcrumbs>
        </div>
      </div>

      <div className="flex-1 py-4 space-y-12">
        <Card shadow="none"
          className="border border-kidemia-grey/20 bg-kidemia-white">
          <CardBody className="space-y-6 py-6 px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-kidemia-black">
                Test Details
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-kidemia-grey/70">
                <FiClock className="w-5 h-5 text-kidemia-secondary" />
                <span className="text-sm font-medium text-kidemia-secondary">
                  {testDetails?.duration_minutes} mins
                </span>
              </div>
            </div>
            <div className='space-y-3'>
              <div className="flex items-center gap-3">
                <p className="font-medium text-kidemia-black">Title:</p>
                <p className="font-medium text-kidemia-black">{testDetails?.title || "N/A"}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-medium text-kidemia-black">Message:</p>
                <p className="font-medium text-kidemia-black">{testDetails?.message || "N/A"}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-medium text-kidemia-black">Total Question:</p>
                <p className="font-medium text-kidemia-black">{testDetails?.total_questions || "N/A"} questions</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-medium text-kidemia-black whitespace-nowrap">Topics Covered:</p>
                <p className="font-medium text-kidemia-black">{testDetails?.topics_covered?.join(", ") || "N/A"}</p>
              </div>
            </div>

          </CardBody>

          <CardFooter className="bg-kidemia-biege/10 border-t border-kidemia-grey/10 px-6 py-4">
            <div className="w-full flex justify-between items-center">
              <p className="text-xs text-kidemia-grey/70 hidden sm:block">
                Click to begin your test
              </p>
              <Button
                className="bg-kidemia-secondary text-white font-semibold shadow-md hover:shadow-lg"
                size="lg"
                radius="md"
                startContent={<BiPlayCircle className="w-5 h-5" />}
                onPress={() => {

                  // console.log(attemptId?.attempt_id, attemptId?.assessment_id);

                  navigate(`/take-a-test/start/${testDetails?.assessment_id}`
                // `/take-a-test/questions/${attemptId?.attempt_id}/${attemptId?.assessment_id}`,
                  )
                }

                }
              >
                Proceed
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
