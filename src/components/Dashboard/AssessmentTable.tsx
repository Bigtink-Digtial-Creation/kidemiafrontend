import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { mockTableData } from "../../staticData";
import { statusTheme } from "../../utils";
import { Link } from "react-router";
import { SidebarRoutes } from "../../routes";

export default function AssessmentTable() {
  return (
    <div>
      <Table
        aria-label="assestment table"
        bottomContent={
          <div className="flex justify-end py-2">
            <Link
              to={SidebarRoutes.performance}
              className="text-sm text-kidemia-primary font-medium hover:underline"
            >
              View More
            </Link>
          </div>
        }
      >
        <TableHeader>
          <TableColumn className="w-12">S/N</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Average Score (%)</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Comment</TableColumn>
          <TableColumn>Date Created</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No available data">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
