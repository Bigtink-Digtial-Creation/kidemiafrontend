import { BreadcrumbItem, Breadcrumbs, Input, Tab, Tabs } from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard } from "react-icons/md";
import { CgPerformance } from "react-icons/cg";
import { TbReportSearch } from "react-icons/tb";
import PerformanceTable from "../../components/Perfomance/PerformanceTable";

export default function PerformancePage() {
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
            href={SidebarRoutes.performance}
            startContent={<CgPerformance />}
          >
            Performance
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="space-y-3">
        <div className="flex justify-end items-center">
          <div>
            <Input
              startContent={
                <TbReportSearch className="text-xl  text-kidemia-secondary" />
              }
              variant="flat"
              size="lg"
              radius="sm"
              placeholder="Search by subjects or topics"
              fullWidth
              isClearable
            />
          </div>
        </div>
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
              <PerformanceTable />
            </Tab>
            <Tab key="topics" title="Topics">
              <PerformanceTable />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
