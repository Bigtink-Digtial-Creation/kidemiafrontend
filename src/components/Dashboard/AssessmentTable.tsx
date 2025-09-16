import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { mockTableData, type TableRowI } from "../../staticData";

const statusTheme: Record<
  TableRowI["status"],
  "success" | "warning" | "danger"
> = {
  completed: "success", // Maps to Chip's color prop
  pending: "warning",
  failed: "danger",
};

export default function AssessmentTable() {
  return (
    <div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn className="w-12">S/N</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Average Score (%)</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Comment</TableColumn>
          <TableColumn>Date Created</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>

        <TableBody>
          {mockTableData.map((mock) => (
            <TableRow key={mock.sn}>
              <TableCell>{mock.sn}</TableCell>
              <TableCell>{mock.title}</TableCell>
              <TableCell>{mock.averageScore}</TableCell>
              <TableCell>
                <Chip
                  color={statusTheme[mock.status]}
                  className="text-xs px-3 capitalize"
                  variant="flat"
                >
                  {mock.status}
                </Chip>
              </TableCell>
              <TableCell>{mock.comment}</TableCell>
              <TableCell>{mock.dateCreated}</TableCell>
              <TableCell className="text-xs text-kidemia-secondary hover:underline cursor-pointer">
                View Result
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
