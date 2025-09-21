import { Button, Pagination } from "@heroui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function QuestionsPage() {
  return (
    <section className="py-4 space-y-12 md:px-12 w-full max-w-4xl">
      <div className="absolute top-0 right-0 px-8 pt-2.5">
        <div className="flex justify-between flex-col md:flex-row items-center gap-2 space-x-6">
          <p className="text-md text-kidemia-black font-medium">
            Time Left: 10mins: 54 Secs
          </p>

          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium px-6"
            size="md"
            radius="sm"
            type="button"
            // onPress={() => navigate(TestRoutes.testSubjects)}
          >
            Submit
          </Button>
        </div>
      </div>

      <div className="py-4">
        <div className="space-y-3">
          <h2 className="text-xl text-kidemia-black font-semibold">
            Question 4:
          </h2>
          <p className="text-lg text-kidemia-grey  font-medium">
            Where is the Medulla Oblongata located?
          </p>
        </div>
        <div className="py-6">options or ansers go here</div>
      </div>

      <div className="flex items-center space-x-6 py-6">
        <Button
          className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
          variant="faded"
          size="md"
          radius="sm"
          type="button"
          startContent={<FaArrowLeft />}
        >
          Previous
        </Button>

        <Button
          className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
          size="md"
          radius="sm"
          type="button"
          endContent={<FaArrowRight />}
        >
          Next
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center py-4">
        <Pagination
          radius="sm"
          initialPage={1}
          total={50}
          classNames={{
            cursor: "border-1 bg-transparent text-kidemia-primary",
            item: "bg-transparent shadow-none cursor-pointer",
          }}
        />
      </div>
    </section>
  );
}
