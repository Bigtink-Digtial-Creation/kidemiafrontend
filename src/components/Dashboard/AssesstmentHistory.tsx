import { Tab, Tabs } from "@heroui/react";
import AssessmentTable from "./AssessmentTable";

export default function AssesstmentHistory() {
  return (
    <div className="p-5 border border-kidemia-grey/15 rounded-2xl">
      <div>
        <Tabs
          aria-label="Assessment"
          size="sm"
          variant="underlined"
          fullWidth
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#BF4C20]",
            tab: "max-w-fit- w-full px-0 h-10",
            tabContent:
              "text-sm  group-data-[selected=true]:text-[#BF4C20] group-data-[selected=true]:font-semibold",
          }}
        >
          <Tab key="subjects" title="Subjects">
            <AssessmentTable />
          </Tab>
          <Tab key="topics" title="Topics">
            <AssessmentTable />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
