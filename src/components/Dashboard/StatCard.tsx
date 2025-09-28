import type { StatsCardProps } from "../../pages/Dashboard/dashboard.interface";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default function StatCard({ icon, title, figure, sub }: StatsCardProps) {
  const IconComponent = icon;
  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]-">
      <div className="pb-5 px-2">
        <CardHeader className="gap-2">
          <div className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center bg-kidemia-biege aspect-square">
            <IconComponent className="text-xl text-kidemia-primary font-bold" />
          </div>
          <span className="text-sm font-semibold text-kidemia-black2">
            {title}
          </span>
        </CardHeader>

        <CardBody>
          <span className="text-4xl font-bold text-kidemia-black text-center">
            {figure}
            <sub className="text-xs md:text-sm text-kidemia-success font-light whitespace-nowrap">
              {sub}
            </sub>
          </span>
        </CardBody>
      </div>
    </Card>
  );
}
