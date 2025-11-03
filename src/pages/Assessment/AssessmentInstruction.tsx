import { BreadcrumbItem, Breadcrumbs, Button } from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { userAtom } from "../../store/user.atom";
import { useAtomValue } from "jotai";
import { assessmentAtom } from "../../store/test.atom";
import { useNavigate, useParams } from "react-router";

export default function AssessmentInstruction() {
  const user = useAtomValue(userAtom);
  const assessment = useAtomValue(assessmentAtom);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <section className="py-4 space-y-12 md:px-12">
        <div className="absolute top-4 left-0 px-4">
          <div>
            <Breadcrumbs variant="light" color="foreground">
              <BreadcrumbItem href={SidebarRoutes.dashboard}>
                Dashboard
              </BreadcrumbItem>
              <BreadcrumbItem href={SidebarRoutes.takeAssessment}>
                Assessments
              </BreadcrumbItem>

              <BreadcrumbItem color="warning">
                Assessments Intructions
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>

        <div className="space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl text-kidemia-black font-semibold">
              Assessments Intructions
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex space-x-6 items-center">
              <h4 className="text-lg text-kidemia-black font-medium">
                Welcome
              </h4>
              <p className="text-lg text-kidemia-primary font-semibold capitalize">
                {user?.first_name} {user?.last_name}
              </p>
            </div>

            <div className="flex space-x-6 items-center">
              <h4 className="text-lg text-kidemia-black font-medium">
                Assessment Title:
              </h4>
              <p className="text-lg text-kidemia-black font-semibold">
                {assessment?.title}
              </p>
            </div>

            <div className="flex space-x-6 items-center">
              <h4 className="text-lg text-kidemia-black font-medium">
                Assessment Code:
              </h4>
              <p className="text-lg text-kidemia-black font-medium">
                {assessment?.code}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <IoIosInformationCircleOutline className="text-red-400 text-xl pointer-events-none shrink-0" />
              <p className="text-red-400 text-base">Attempt all questions.</p>
            </div>

            <div className="flex items-center space-x-2">
              <IoIosInformationCircleOutline className="text-red-400 text-xl pointer-events-none shrink-0" />
              <p className="text-red-400 text-base">
                You cant leave once you start.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <IoIosInformationCircleOutline className="text-red-400 text-xl pointer-events-none shrink-0" />
              <p className="text-red-400 text-base">
                If you close this window, we assumme you're done with your
                assessment
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex space-x-6 items-center">
              <h4 className="text-lg text-kidemia-black font-medium">
                Total Mark:
              </h4>
              <p className="text-lg text-kidemia-primary font-semibold">
                {assessment?.avgScore} Marks
              </p>
            </div>

            <div className="flex space-x-6 items-center">
              <h4 className="text-lg text-kidemia-black font-medium">
                Duration:
              </h4>
              <p className="text-lg text-kidemia-black font-semibold">
                {assessment?.timeMins} Mins
              </p>
            </div>

            <div className="flex space-x-6 items-center">
              <h4 className="text-lg text-kidemia-black font-medium">
                Questions:
              </h4>
              <p className="text-lg text-kidemia-black font-semibold">
                {assessment?.questionsNo} Questions
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-6">
            <Button
              className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
              variant="faded"
              size="md"
              radius="sm"
              type="button"
              onPress={() => navigate(SidebarRoutes.takeAssessment)}
            >
              Go Back
            </Button>
            <Button
              className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
              size="md"
              radius="sm"
              type="button"
              onPress={() => navigate(`/assessment/${id}/questions`)}
            >
              Start Assessment
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
