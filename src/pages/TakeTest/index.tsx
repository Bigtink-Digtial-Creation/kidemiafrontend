import { BreadcrumbItem, Breadcrumbs, Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { SidebarRoutes, TestRoutes } from "../../routes";

export default function TakeTestPage() {
  const navigate = useNavigate();
  return (
    <>
    <section className="py-4 space-y-12 md:px-12">
        <div className="absolute top-4 left-0 px-4">
          <div>
            <Breadcrumbs variant="light" color="foreground">
              <BreadcrumbItem
                href={SidebarRoutes.dashboard}
              >
                Dashboard
              </BreadcrumbItem>
              <BreadcrumbItem
                color="warning"
              >
                Take a Test
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <div className="space-y-4">
        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
          Welcome To Kidemia Test Section
        </h2>
        <div className="max-w-xl space-y-1.5">
          <p className="text-lg text-kidemia-grey text-center font-medium tracking-wider">
            This is your opportunity to put your knowledge and skills to the
            test. Stay focused, do your best, and show what you've learned. We
            believe in you!
          </p>
          <p className="text-lg text-kidemia-grey text-center font-medium tracking-wider">
            When you're ready, click <span className="font-bold">Continue</span>{" "}
            to begin.
          </p>
        </div>
        </div><div className="flex items-center space-x-6 py-6">
        <Button
          className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
          variant="faded"
          size="md"
          radius="sm"
          type="button"
          onPress={() => navigate(SidebarRoutes.dashboard)}
        >
          Cancel
        </Button>

        <Button
          className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
          size="md"
          radius="sm"
          type="button"
          onPress={() => navigate(TestRoutes.testSubjects)}
        >
          Continue
        </Button>
      </div>
    </section>
    </>
  );
}
