import { Button, useDisclosure } from "@heroui/react";
import { useNavigate } from "react-router";
import { TestRoutes } from "../../routes";
import ResultWaiting from "./Modal/ResultWaiting";

export default function ReviewSubmission() {
  const navigate = useNavigate();
  const resultModal = useDisclosure();

  return (
    <>
      <section className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-kidemia-primary">
            Review Your Answers
          </h2>
          <p className="text-kidemia-grey max-w-md">
            Please take a moment to review your answers before submitting. Once
            submitted, you won't be able to make any changes.
          </p>
        </div>

        <div className="flex gap-6">
          <Button
            className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
            variant="faded"
            size="md"
            radius="sm"
            type="button"
            onPress={() => navigate(TestRoutes.questions)}
          >
            Go Back to Questions
          </Button>

          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            onPress={() => resultModal.onOpen()}
          >
            Submit and View Results
          </Button>
        </div>
      </section>
      <ResultWaiting
        isOpen={resultModal.isOpen}
        onClose={resultModal.onClose}
      />
    </>
  );
}
