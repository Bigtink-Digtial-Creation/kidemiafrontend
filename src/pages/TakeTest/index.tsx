import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { SidebarRoutes, TestRoutes } from "../../routes";

export default function TakeTestPage() {
  const navigate = useNavigate();
  return (
    <section className="py-4 space-y-12 md:px-12">
      <div className="space-y-3">
        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
          Test Yourself
        </h2>
        <p className="text-lg text-kidemia-grey text-center font-medium">
          The test comprises of 20 questions to be answered in 20 mins
        </p>
      </div>

      <div className="flex items-center space-x-6 py-6">
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
  );
}
