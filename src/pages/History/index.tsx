import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdManageHistory } from "react-icons/md";
import HistoryTable from "../../components/History/HistoryTable";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs variant="light" color="foreground">
          <BreadcrumbItem
            href={SidebarRoutes.dashboard}
            startContent={<MdOutlineDashboard />}
          >
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbItem
            href={SidebarRoutes.history}
            startContent={<MdManageHistory />}
            color="warning"
          >
            History
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="space-y-3">
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
            <Tab key="test" title="Test History">
              <HistoryTable />
            </Tab>
            <Tab key="exam" title="Exam History">
              <HistoryTable />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
