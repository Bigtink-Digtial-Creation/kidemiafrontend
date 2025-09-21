import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { TestRoutes } from "../../routes";

export default function TestInstrusctionsPage() {
  const navigate = useNavigate();
  return (
    <section className="py-4 space-y-12 md:px-12">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl text-kidemia-black font-semibold text-center">
          You are writing Social Studies
        </h2>
        <p className="text-md md:text-xl text-kidemia-grey  font-medium">
          The test has 20 questions to be answered in 20 minutes, it will cover
          the following topics:
        </p>
        <ol className="list-decimal list-inside">
          <li className="text-md text-kidemia-black3">Family</li>
          <li className="text-md text-kidemia-black3">Racism</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl md:text-2xl text-kidemia-black font-semibold text-center">
          Read All Instructions Before You Start
        </h2>

        <ol className="list-decimal list-inside">
          <li className="text-md text-kidemia-black3">
            Do not leave this screen else the test would end
          </li>
          <li className="text-md text-kidemia-black3">
            Do not leave this screen else the test would end
          </li>
        </ol>
      </div>

      <div className="absolute bottom-0 right-4 py-5 px-4">
        <div className="space-y-6">
          <p className="text-md font-semibold text-kidemia-black">
            If you are ready click on the button to begin
          </p>

          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            onPress={() => navigate(TestRoutes.questions)}
          >
            Start
          </Button>
        </div>
      </div>
    </section>
  );
}
