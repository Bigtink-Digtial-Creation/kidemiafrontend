import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { Link } from "react-router";
import { SidebarRoutes } from "../../../routes";

interface HistoryItem {
  sn: number;
  title: string;
  assessment_id: string;
  attempt_id: string;
  average_score: string;
  status: string;
  comment: string;
  date_created: string;
}

interface Props {
  data: HistoryItem[];
  emptyMessage?: string;
}

const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
  excellent: "success",
  good: "warning",
  "needs improvement": "danger",
  pending: "default",
};

export default function AssessmentTable({ data, emptyMessage = "No data available" }: Props) {
  return (
    <div>
      <Table
        aria-label="assessment table"
        bottomContent={
          data.length > 0 ? (
            <div className="flex justify-end py-2">
              <Link
                to={SidebarRoutes.performance}
                className="text-sm text-kidemia-primary font-medium hover:underline"
              >
                View More
              </Link>
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn className="w-12">S/N</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Average Score</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Comment</TableColumn>
          <TableColumn>Date</TableColumn>
        </TableHeader>

        <TableBody emptyContent={emptyMessage}>
          {data.map((item) => (
            <TableRow key={item.attempt_id}>
              <TableCell>{item.sn}</TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate" title={item.title}>
                  {item.title}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold">{item.average_score}</span>
              </TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[item.status] || "default"}
                  className="text-xs px-3 capitalize"
                  variant="flat"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="max-w-[150px] truncate" title={item.comment}>
                  {item.comment}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{item.date_created}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}