import { useState } from "react";
import { useNavigate } from "react-router";
import CustomCheckbox from "../../components/Cards/CustomCheckbox";
import { Button, CheckboxGroup } from "@heroui/react";
import { topicsData } from "../../staticData";
import { TestRoutes } from "../../routes";

export default function TestTopicsPage() {
  const [groupSelected, setGroupSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  console.log(groupSelected);

  return (
    <section className="py-4 space-y-12 md:px-12">
      <div className="space-y-3">
        <h2 className="text-2xl text-kidemia-black font-semibold text-center">
          Select up to 5 topics you want to write on
        </h2>
      </div>

      <div>
        <CheckboxGroup
          classNames={{
            base: "w-full",
          }}
          value={groupSelected}
          onChange={(values) => {
            if (values.length <= 5) {
              setGroupSelected(values);
            }
          }}
          orientation="horizontal"

        >
          {topicsData.map((topics) => (
            <div key={topics.id}>
              <CustomCheckbox value={topics.value} />
            </div>
          ))}
        </CheckboxGroup>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="solid"
          size="lg"
          className="bg-kidemia-secondary text-kidemia-white font-semibold w-1/4"
          radius="sm"
          isDisabled={groupSelected.length !== 5}
          onPress={() => navigate(TestRoutes.testIntructions)}
        >
          Continue
        </Button>
      </div>
    </section>
  );
}
